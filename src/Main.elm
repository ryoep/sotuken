port module Main exposing (..)

import Browser
import Browser.Events exposing (onAnimationFrameDelta)
import Html exposing (Attribute, Html, div, img, input, a, i, text, select, option, datalist)
import Html.Attributes exposing (class, src, style, value, hidden, selected, list, id)
import Html.Events exposing (custom, targetValue)
import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Extra as Decode
import Json.Encode as Encode
import Html.Keyed as Keyed
import Html.Lazy exposing (lazy3, lazy4)
import Svg exposing (g, path, rect, svg)
import Svg.Attributes exposing (d, fill, height, stroke, strokeWidth, viewBox, width, transform, x, y)
import Html exposing (a,button, br)
import Html exposing (i)
import Array exposing (..)
import Dict exposing (..)
import Set exposing (..)
import Html.Attributes exposing (placeholder, disabled)
import Task exposing (..)
import Process exposing (..)
import File exposing (File)
import File.Download as Download
import File.Select as Select

main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


-- PORTS


--port sendAST : Encode.Value -> Cmd msg
port sendArray : Encode.Value -> Cmd msg

-- MODEL


type alias Magnitude =
    Float


type alias Position =
    ( Magnitude, Magnitude )


type Direction
    = ToRight
    | ToBottom


type BrickType
    = BasicBrick
    | EntryBrick
    | CallBrick
    | CaseBrick
    | SpacerBrick


type BrickCommand
    = CommandNOP
    | CommandCalc
    | CommandPop
    | CommandPush
    | CommandPenDown
    | CommandPenUp
    | CommandInit
    | CommandToioWait
    | CommandToioMoveForward
    | CommandToioMoveBackward
    | CommandToioTurnLeft
    | CommandToioTurnRight
    | CommandToioStopMoving
    | CommandToioPlayPresetSound
    | CommandToioStopPlaying
    | CommandToioTurnOnLED_Red
    | CommandToioTurnOnLED_Blue
    | CommandToioTurnOnLED_Green
    | CommandToioTurnOffLED

type Operator = Add | Sub | Mul | Div | Quotient | Mod
type Comparator =  Eq -- == Equal
                 | Ne -- != Not Equal
                 | Gt --  > Greater Than
                 | Lt --  < Less Than
                 | Ge -- >= Greater Equal
                 | Le -- <= Less Equal

type Text =   Name  String -- Entry & Call ブロック用
            | Param String  -- 動作ブロック用(直進, 回転など...) 移動距離[px], 回転角度[°]を指定
            | Pen PenState  -- ペンの上げ下げブロック用
            | Push String -- 値をスタックにプッシュ
            | Pop  String -- 値をスタックからポップし, 名前を付けて辞書に登録
            | Init  String String -- 変数初期化ブロック用
            | Calc  String String Operator String -- 算術演算ブロック用
            | Cond  String Comparator String -- 条件分岐ブロック用
            | Space String -- スペーサーブロック用 (方向を表す)

type PenState = Up | Down

type alias Node =
    { getBrickType : BrickType
    , getBrickCommand : BrickCommand
    , getText : Text
    }


-- 抽象構文木（AST）
-- 子ノードは直下、直右の順
type AST a
    = Nil
    | AST a (AST a) (AST a)


-- 非空（non-empty）のAST
type ASTne a
    = ASTne a (AST a) (AST a)


-- ASTneのASTへのキャスト（読み替え）
asAST : ASTne a -> AST a
asAST (ASTne n b r) =
    AST n b r


-- 根の位置情報付きのAST
type ASTxy a
    = ASTxy
        Position
        -- 座標は根のみで十分
        (ASTne a)


type alias DnDInfo =
    { getOnDnD : Bool -- DnDの最中は真
    , getMouseXY : Position -- DnD開始時のマウスのpageX/Y, moveに追従して変化
    , getRootXY : Position -- DnD開始時のブロック（これは常にルート）の座標, moveに追従して変化
    }

-- タートルのコマンド
type Command
    = Wait Float -- ms
    | Forward Float -- px
    | Turn Float -- deg. (-360 - +360を越えると無駄に転回するのも仕様)

-- タートルの状態
type RunState
    = Start -- 実行開始
    | Running -- コマンド実行中
    | Waiting -- コマンド実行待ち
    | Done -- 終了

type Value =
        FloatValue Float
      | StringValue String

-- タートル
type alias Turtle =
    { x : Float -- タートルのx座標
    , y : Float -- タートルのy座標
    , w : Float -- タートルのサイズ
    , heading : Float -- タートルの向き
    , initX : Float -- タートルの初期座標x
    , initY : Float -- タートルの初期座標y
    , initHeading : Float -- タートルの初期方向
    , forward_remaining : Float -- 前進のやり残し量
    , turn_remaining : Float -- 転回のやり残し量
    , wait_remaining : Float -- 待機のやり残し量
    , velocity : Float -- 速度(1[px/ms])
    , avelocity : Float -- 角速度(1[°/ms])
    , state : RunState -- コマンド実行状態
    , current : AST Node --現在保持中の部分木
    , variables : Dict String Value -- 変数辞書
    , callStack : List (AST Node,  Dict String Value) -- 関数呼び出し時に現在の木(current)と変数辞書(variables)を保存しておくためのスタック. 呼び出し終了後にポップして復帰する.
    , stack : List Value -- データスタック(ルーチン呼び出し時のデータの受け渡しで使用)
    , penState : PenState -- ペンの状態
    , lines : List String -- 描画する線のパス
    }


type alias Model =
    { getBrickSize : Magnitude
    , getASTRoots : List (ASTxy Node)
    , getDnDInfo : DnDInfo
    , varNames : Set String
    , routineNames : Set String -- ルーチン名のセット
    , routineBox : String       -- ルーチン名を入力するボックス
    , initXBox : String         -- タートルの初期位置のx座標を入力するボックス
    , initYBox : String         -- タートルの初期位置のy座標を入力するボックス
    , initHeadingBox : String   -- タートルの初期方向を入力するボックス
    , turtle : Turtle
    }


-- ブロック間の間隔
-- 凹凸の分を除くのでブロックサイズの90%
interval : Model -> Magnitude
interval model =
    model.getBrickSize * 0.9


-- 位置比較時のマージン
mergin : Magnitude
mergin = 20


createNewRoot : ( Position, a ) -> ASTxy a
createNewRoot ( ( x, y ), node ) =
    ASTxy ( x, y ) (ASTne node Nil Nil)


pallet : List ( Position, Node )
pallet =
    [ ( ( 20, 100 )
      , { getBrickType = BasicBrick
        , getBrickCommand = CommandToioMoveForward
        , getText = Param "50"
        }
      )
    , ( ( 170, 100 )
      , { getBrickType = BasicBrick
        , getBrickCommand = CommandToioMoveBackward
        , getText = Param "50"
        }
      )
    , ( ( 20, 250 )
      , { getBrickType = BasicBrick
        , getBrickCommand = CommandToioTurnLeft
        , getText = Param "90"
        }
      )
    , ( ( 170, 250 )
      , { getBrickType = BasicBrick
        , getBrickCommand = CommandToioTurnRight
        , getText = Param "90"
        }
      )
    , ( ( 20, 400 )
      , { getBrickType = CaseBrick
        , getBrickCommand = CommandNOP
        , getText = Cond "" Eq ""
        }
      )
    , ( ( 20, 550 )
      , { getBrickType = BasicBrick
        , getBrickCommand = CommandInit
        , getText = Init "" ""
        }
      )
    , ( ( 170, 550 )
      , { getBrickType = BasicBrick
        , getBrickCommand = CommandCalc
        , getText = Calc "" "" Add ""
        }
      )
    , ( ( 20, 700 )
      , { getBrickType = BasicBrick
        , getBrickCommand = CommandPush
        , getText = Push ""
        }
      )
    , ( ( 170, 700 )
      , { getBrickType = BasicBrick
        , getBrickCommand = CommandPop
        , getText = Pop ""
        }
      )
    , ( (  20, 850 )
      , { getBrickType = BasicBrick
        , getBrickCommand = CommandPenDown
        , getText = Pen Down
        }
      )
    , ( (  170, 850 )
      , { getBrickType = BasicBrick
        , getBrickCommand = CommandPenUp
        , getText = Pen Up
        }
      )
    , ( ( 20, 1000 )
      , { getBrickType = EntryBrick
        , getBrickCommand = CommandNOP
        , getText = Name "usagi"
        }
      )
    , ( ( 170, 1000 )
      , { getBrickType = CallBrick
        , getBrickCommand = CommandNOP
        , getText = Name "usagi"
        }
      )
    , ( ( 20, 1150 )
      , { getBrickType = EntryBrick
        , getBrickCommand = CommandNOP
        , getText = Name "kuma"
        }
      )
    , ( ( 170, 1150 )
      , { getBrickType = CallBrick
        , getBrickCommand = CommandNOP
        , getText = Name "kuma"
        }
      )
    , ( (  20, 1300 )
      , { getBrickType = SpacerBrick
        , getBrickCommand = CommandNOP
        , getText = Space "right"
        }
      )
    , ( ( 170, 1300 )
      , { getBrickType = SpacerBrick
        , getBrickCommand = CommandNOP
        , getText = Space "down"
        }
      )
    ]

init : () -> (Model, Cmd Msg)
init _ =
    ( { getBrickSize = 128
      , getASTRoots = []
      , getDnDInfo =
          { getOnDnD = False
          , getMouseXY = ( 0, 0 )
          , getRootXY = ( 0, 0 )
          }
      , varNames = Set.empty
      , routineNames = Set.fromList ["usagi", "kuma"]
      , routineBox   = ""
      , initXBox = "150"
      , initYBox = "150"
      , initHeadingBox = "270"
      , turtle = 
          { x = 150
          , y = 150
          , w = 32
          , heading = 270
          , initX = 150
          , initY = 150
          , initHeading = 270
          , forward_remaining = 0
          , turn_remaining = 0
          , wait_remaining = 0
          , velocity = 0
          , avelocity = 0
          , state = Done
          , current = Nil
          , variables = Dict.empty
          , callStack = []
          , stack = []
          , penState = Up
          , lines = []
          }
      }
    , Cmd.none
    )

-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    if model.turtle.state == Running then
        onAnimationFrameDelta MsgTick
    else Sub.none


-- UPDATE
    

type Msg
    = MsgCloneUs (ASTxy Node)
    | MsgNoOp
    | MsgLetMeRoot (ASTxy Node) Position
    | MsgMoveUs Position
    | MsgAttachMe (ASTxy Node)
    | MsgStartDnD Position Position
    | MsgInputChanged Position Int String
    | MsgCheckString  Position Int String
    | MsgSetVarNames -- 全ての変数名を取得
    | MsgRoutineBoxChanged String -- ルーチン名を入力するボックスに文字が入力されたときのメッセージ
    | MsgMakeNewRoutine -- ルーチン作成ボタンが押されたときのメッセージ
    | MsgInitXChanged String        -- タートルの初期x座標が変更されたときのメッセージ
    | MsgInitYChanged String        -- タートルの初期y座標が変更されたときのメッセージ
    | MsgInitHeadingChanged String  -- タートルの初期方向 が変更されたときのメッセージ
    | MsgInitXBlur       -- タートルの初期x座標入力ボックスからフォーカスが外れたときのメッセージ
    | MsgInitYBlur       -- タートルの初期y座標入力ボックスからフォーカスが外れたときのメッセージ
    | MsgInitHeadingBlur -- タートルの初期 方向入力ボックスからフォーカスが外れたときのメッセージ
    | MsgDblClick
    | MsgTick Float
    | MsgRun
    | MsgDownload
    | MsgRequested
    | MsgSelected File
    | MsgLoaded String
    | MsgNOP


-- 指定したルーチンを取得する関数
-- なかったときはNilを返す
getRoutine : List (ASTxy Node) -> Text -> AST Node
getRoutine roots name =
    case roots of
        [] ->
            Nil
        (ASTxy _ (ASTne node _ _ as ast)) :: remain ->
            if node.getBrickType == EntryBrick && -- 先頭がエントリーブロックかつ
                node.getText == name then         -- テキストが探しているものと一致
                    asAST <| ast
            else
                getRoutine remain name


-- プログラム実行前にリセット(残りの仕事を0にしたり変数をリセットしたり)する関数
clearTurtle : Turtle -> Turtle
clearTurtle turtle =
    { turtle 
        | current = Nil
        , x = turtle.initX
        , y = turtle.initY
        , heading = turtle.initHeading
        , forward_remaining = 0
        , wait_remaining = 0
        , turn_remaining = 0
        , velocity = 0.1
        , avelocity = 0.2
        , state = Done
        , variables = Dict.empty
        , stack = []
        , callStack = []
        , penState = Up
        , lines = []
    }

-- プログラムをJson形式にしたものを文字列化して保存する
saveProgram : List(ASTxy Node) -> Cmd msg
saveProgram roots =
    roots
    |> astRootsEncode
    |> Encode.encode 4
    |> Download.string "program.json" "application/json"

proceed : Cmd Msg
proceed =
    Process.sleep 0 |> Task.perform (always MsgRun)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        -- MsgCloneUs ast ->
        --    Debug.log "MsgCloneUs received" ( cloneUs ast model, Cmd.none )
        MsgCloneUs ast ->
            ( cloneUs ast model, Cmd.none )
        MsgNoOp ->
            -- NoAction では何もせずそのまま model を返す
            (model, Cmd.none)
        MsgStartDnD rootXY mouseXY ->
            ( startDnD rootXY mouseXY model, Cmd.none )
        MsgLetMeRoot (ASTxy rootXY ast) mouseXY ->
            ( model |> letMeRoot (ASTxy rootXY ast) |> startDnD rootXY mouseXY, Cmd.none )
        MsgMoveUs mouseXY ->
            ( moveUs mouseXY model, Cmd.none )
        MsgAttachMe (ASTxy rootXY ast) ->
            ( model |> stopDnD rootXY |> attachMe (ASTxy rootXY ast), Cmd.none )
        MsgInputChanged xy place text ->
            ( modifyText modifyTextData   xy place text model, Cmd.none )
        MsgCheckString xy place text ->
            ( modifyText completeDblquote xy place text model, Cmd.none )
        MsgSetVarNames ->
            ( getVarNames model, Cmd.none )
        MsgRoutineBoxChanged name ->
            ( { model | routineBox = name }, Cmd.none )
        MsgMakeNewRoutine ->
            ( makeNewRoutine model, Cmd.none )
        MsgInitXChanged       str -> ( modifyInitX       str model, Cmd.none )
        MsgInitYChanged       str -> ( modifyInitY       str model, Cmd.none )
        MsgInitHeadingChanged str -> ( modifyInitHeading str model, Cmd.none )
        MsgInitXBlur       -> ( checkInitX       model, Cmd.none )
        MsgInitYBlur       -> ( checkInitY       model, Cmd.none )
        MsgInitHeadingBlur -> ( checkInitHeading model, Cmd.none )
        MsgDblClick ->
            let
                getReady turtle = { turtle | state = Start }
            in
                ( { model | turtle = getReady <| clearTurtle <| model.turtle }, proceed )
        MsgTick delta ->
            move delta model
        MsgRun ->
            run runLimit model
        MsgDownload ->
            ( model, saveProgram model.getASTRoots )
        MsgRequested ->
            ( model, Select.file ["application/json"] MsgSelected)
        MsgSelected file ->
            ( model, Task.perform MsgLoaded (File.toString file) )
        MsgLoaded content ->
            ( loadProgram content model, Cmd.none )
        MsgNOP ->
            ( model, Cmd.none )


-- 新しい名前のルーチンを作成し, そのエントリーブロックを出現させる関数
makeNewRoutine : Model -> Model
makeNewRoutine model =
    let
        isEntryExist = -- 同名のエントリーブロックが画面上に存在するか
            List.any
                (\(ASTxy _ (ASTne node _ _)) -> node.getBrickType == EntryBrick &&
                                                node.getText == Name model.routineBox)
                model.getASTRoots
        newEntryBrick = 
            { getBrickType = EntryBrick
            , getBrickCommand = CommandNOP
            , getText = Name model.routineBox
            }
        newRoot =
            ASTxy (300, 100) (ASTne newEntryBrick Nil Nil) -- 座標は適当
        addedModel =
            addASTxy newRoot model
    in
        if model.routineBox /= "" &&  not isEntryExist then
            { addedModel | routineBox = "", routineNames = Set.insert model.routineBox model.routineNames }
        else
            model


modifyInitX : String -> Model -> Model
modifyInitX x model =
    if model.turtle.state /= Done then
        model
    else
        let
            newXBox =
                if isFloat x then x else model.initXBox
            newX =
                case String.toFloat newXBox of
                    Just num -> num
                    Nothing  -> model.turtle.x
            modifyTurtle turtle =
                { turtle | initX = newX }
        in
            { model
                | initXBox    = newXBox
                , turtle = clearTurtle <| modifyTurtle model.turtle
            }

modifyInitY : String -> Model -> Model
modifyInitY y model =
    if model.turtle.state /= Done then
        model
    else
        let
            newYBox =
                if isFloat y then y else model.initYBox
            newY =
                case String.toFloat newYBox of
                    Just num -> num
                    Nothing  -> model.turtle.y
            modifyTurtle turtle =
                { turtle | initY = newY }
        in
            { model
                | initYBox    = newYBox
                , turtle = clearTurtle <| modifyTurtle model.turtle
            }

modifyInitHeading : String -> Model -> Model
modifyInitHeading heading model =
    if model.turtle.state /= Done then
        model
    else
        let
            newHeadingBox =
                if isFloat heading then heading else model.initHeadingBox
            newHeading =
                case String.toFloat newHeadingBox of
                    Just num -> num
                    Nothing  -> model.turtle.heading
            modifyTurtle turtle =
                { turtle | initHeading = newHeading }
        in
            { model
                | initHeadingBox    = newHeadingBox
                , turtle = clearTurtle <| modifyTurtle model.turtle
            }


checkInitX : Model -> Model
checkInitX model =
    if model.turtle.state /= Done then
        model
    else
        let
            newXBox =
                if String.isEmpty model.initXBox then "150" else model.initXBox
            newX =
                case String.toFloat newXBox of
                    Just num -> num
                    Nothing  -> model.turtle.x
            modifyTurtle turtle =
                { turtle | initX = newX }
        in
            { model
                | initXBox = newXBox
                , turtle   = clearTurtle <| modifyTurtle model.turtle
            }

checkInitY : Model -> Model
checkInitY model =
    if model.turtle.state /= Done then
        model
    else
        let
            newYBox =
                if String.isEmpty model.initYBox then "150" else model.initYBox
            newY =
                case String.toFloat newYBox of
                    Just num -> num
                    Nothing  -> model.turtle.y
            modifyTurtle turtle =
                { turtle | initY = newY }
        in
            { model
                | initYBox = newYBox
                , turtle   = clearTurtle <| modifyTurtle model.turtle
            }

checkInitHeading : Model -> Model
checkInitHeading model =
    if model.turtle.state /= Done then
        model
    else
        let
            newHeadingBox =
                if String.isEmpty model.initHeadingBox then "270" else model.initHeadingBox
            newHeading =
                case String.toFloat newHeadingBox of
                    Just num -> num
                    Nothing  -> model.turtle.heading
            modifyTurtle turtle =
                { turtle | initHeading = newHeading }
        in
            { model
                | initHeadingBox = newHeadingBox
                , turtle   = clearTurtle <| modifyTurtle model.turtle
            }


-- 符号を返す関数getSign(0のときは1を返す)
getSign : number -> number
getSign num = 
    if      num >= 0 then  1
    else -1

run_wait : Text -> Turtle -> Turtle
run_wait text turtle =
    case text of
        Param str ->
            case getValue str turtle.variables of
                Just (FloatValue duration) ->
                    { turtle
                        | wait_remaining = duration * 1000
                        , state = Running
                    }
                _ ->
                    turtle
        _ ->
            turtle

-- BoolがTrueのとき前進を正, Falseのとき後退を正とする
run_forward : Bool -> Text -> Turtle -> Turtle
run_forward isForward text turtle =
    case text of
        Param str ->
            case getValue str turtle.variables of
                Just (FloatValue num) ->
                    let distance = if isForward then num else -1 * num
                    in
                        { turtle
                            | forward_remaining = distance
                            , velocity = (getSign distance) * (abs turtle.velocity) -- 移動距離の符号に応じて速度の符号も変更
                            , lines = 
                                if turtle.penState == Down then
                                    turtle.lines ++ [ "M", String.fromFloat (turtle.x + turtle.w/2) , String.fromFloat (turtle.y + turtle.w/2)
                                                    , "L", String.fromFloat (turtle.x + turtle.w/2) , String.fromFloat (turtle.y + turtle.w/2)
                                                    ]
                                else
                                    turtle.lines
                            , state = Running
                        }
                _ ->
                    turtle
        _ ->
            turtle


-- BoolがTrueのとき右回転を正, Falseのとき左回転を正とする
run_turn : Bool -> Text -> Turtle -> Turtle
run_turn isRight text turtle =
    case text of
        Param str ->
            case getValue str turtle.variables of
                Just (FloatValue num) ->
                    let angle = if isRight then num else -1 * num
                    in
                        { turtle
                            | turn_remaining = angle
                            , avelocity = (getSign angle) * (abs turtle.avelocity)
                            , state = Running
                        }
                _ ->
                    turtle
        _ -> 
            turtle



-- 入力ボックスの内容を受け取り, その値をValue型で返す関数getValue
--      ex... "123"    -> Just (FloatValue  123)
--           　""abc"" -> Just (StringValue abc)
--      数でも文字列でもないなら辞書から探す.
getValue : String -> Dict String Value -> Maybe Value
getValue str variables = 
    case String.toFloat str of
        Just num ->
            Just (FloatValue num)
        Nothing ->
            if String.startsWith "\"" str &&
               String.endsWith   "\"" str &&
               String.length str >= 2
                then Just (StringValue (deleteDblquote str))
            else -- 変数名だった場合
                Dict.get str variables  -- 辞書を探して値を返す(ないならNothig)


-- a / bの余りを計算する関数(小数&負数に対応)
remainder : Float -> Float -> Float
remainder a b =
    let 
        q = floor (a / b)
        --q = truncate (a / b)
        r = a - (b * toFloat q)
    in
        r

-- 演算子と2つの被演算子を受け取って計算を行う関数
calculate : Float -> Operator -> Float -> Float
calculate num1 op num2 =
    case op of
        Add      -> num1 + num2
        Sub      -> num1 - num2
        Mul      -> num1 * num2
        Div      -> num1 / num2
        Quotient -> toFloat <| floor <| num1 / num2
        Mod      -> remainder num1 num2

-- 1つの比較演算子と2つの文字列or数字を受け取り, 比較を行う関数
compare : comparable -> Comparator -> comparable -> Bool
compare val1 cp val2 =
    case cp of
        Eq -> val1 == val2
        Ne -> val1 /= val2
        Gt -> val1 >  val2
        Lt -> val1 <  val2
        Ge -> val1 >= val2
        Le -> val1 <= val2


-- push : a -> List a -> List a
-- push val stack =
--     val :: stack

-- pop : List a -> Maybe (a, List a)
-- pop stack =
--     case stack of
--         [] ->
--             Nothing
--         val :: remain ->
--             Just (val, remain)



run_push : Text -> Turtle -> Turtle
run_push text turtle =
    case text of
        Push str ->
            case getValue str turtle.variables of
                Nothing ->
                    turtle
                Just val ->
                    { turtle | stack = val :: turtle.stack }
        _ ->
            turtle


run_pop : Text -> Turtle -> Turtle
run_pop text turtle =
    case text of
        Pop var ->
            if String.isEmpty var || not (isVariable var) then
                turtle -- 変数名でないならば何もしない
            else
                case turtle.stack of
                    [] ->
                        turtle
                    val :: remain ->
                        { turtle
                            | stack     = remain
                            , variables = Dict.insert var val turtle.variables
                        }
        _ ->
            turtle


run_calculate : Text -> Turtle -> Turtle
run_calculate text turtle =
    case text of
        Calc var str1 op str2 ->
            if String.isEmpty var || not (isVariable var) then
                turtle -- 変数名でないならば何もしない
            else
                let
                    num1 =
                        case getValue str1 turtle.variables of
                            Just (FloatValue num) -> num
                            _ -> 0
                    num2 =
                        case getValue str2 turtle.variables of
                            Just (FloatValue num) -> num
                            _ -> 0
                    newVariables =
                        Dict.insert var (FloatValue (calculate num1 op num2)) turtle.variables
                in
                    { turtle | variables = newVariables }
        _ ->
            turtle

run_init : Text -> Turtle -> Turtle
run_init text turtle =
    case text of
        Init var str ->
            if String.isEmpty var || not (isVariable var) then
                turtle -- 左辺が変数名でないならば何もしない
            else
                let newVariables =
                        case getValue str turtle.variables of
                            Just val -> -- 右辺がFloatかString(OK)
                                Dict.insert var val turtle.variables
                            Nothing ->
                                turtle.variables
                in  { turtle | variables = newVariables }
        _ ->
            turtle


run_case : Text -> Turtle -> Turtle
run_case text turtle =
    case text of
        Cond str1 cp str2 ->
            let result =
                    case getValue str1 turtle.variables of
                        Just (FloatValue num1) ->
                            case getValue str2 turtle.variables of
                                Just (FloatValue num2) -> compare num1 cp num2
                                _ -> False
                        Just (StringValue string1) ->
                            case getValue str2 turtle.variables of
                                Just (StringValue string2) -> compare string1 cp string2
                                _ -> False
                        _ ->
                            False
                modifiedCurrent =
                    case turtle.current of
                        Nil ->
                            Nil
                        AST node left right ->
                            if result then
                                 AST node Nil right -- 条件が True  なら左の部分木をNilにする
                            else AST node left Nil  -- 条件が False なら右の部分木をNilにする
            in  { turtle | current = modifiedCurrent }
        _ -> --テキストが間違っているorこの関数を間違った場所で呼んだ場合(あり得ないはずだが一応)
            turtle

run_pen : Text -> Turtle -> Turtle
run_pen text turtle =
    case text of
        Pen state ->
            { turtle | penState = state }
        _ ->
            turtle

next : List (ASTxy Node) -> Turtle -> Turtle
next roots turtle =
    case turtle.state of
        Start ->
            case roots |> List.reverse |> List.head of
                Nothing ->
                    { turtle | current = Nil }
                Just (ASTxy _ astne)->
                    { turtle | current = asAST astne, state = Waiting }
        Waiting ->
            case turtle.current of
                Nil ->
                    case turtle.callStack of
                        [] ->
                            { turtle | current = Nil }
                        (retCurrent, retVariables) :: remain ->
                            { turtle 
                            | current   = retCurrent
                            , variables = retVariables
                            , callStack = remain
                            }
                AST node left right ->
                    case node.getBrickType of
                        CallBrick -> -- nodeがルーチン呼び出しブロックなら
                            case getRoutine roots node.getText of -- 対応するルーチンがあるか調べる
                                Nil ->  -- 対応するルーチンがなかった場合
                                    if left == Nil && right == Nil then -- 右の子も左の子もNilなら...
                                        next roots { turtle | current = Nil }     -- currentをNilにしてもう一度next(callStackが空かどうか調べるため)
                                    else                                -- 右の子か左の子がNilでないなら...
                                        { turtle | current = if left /= Nil then left else right } -- Nilでない子どもに移動
                                ast -> -- 対応するルーチンがあった場合
                                    if left == Nil && right == Nil then -- 右の子も左の子もNilなら...
                                        { turtle | current = ast, variables = Dict.empty } -- 呼び出したルーチンへ移動(呼び出しブロック以降に命令がないので戻ってくる必要がない=現在の状態をcallStackに保存する必要がない)
                                    else                                -- 右の子か左の子がNilでないなら...
                                        { turtle
                                        | current   = ast -- 呼び出したルーチンへ移動
                                        , variables = Dict.empty
                                        , callStack = (if left /= Nil then left else right, turtle.variables) :: turtle.callStack -- ルーチン終了後に呼び出し元に戻るため, callStackに現在の辞書と子どもを保存しておく
                                        }
                        _ -> -- nodeがルーチン呼び出しブロックか条件分岐ブロックでない場合
                            if left == Nil && right == Nil then -- 右の子も左の子もNilなら...
                                next roots { turtle | current = Nil }     -- currentをNilにしてもう一度next(callStackが空かどうか調べるため)
                            else                                -- 右の子か左の子がNilでないなら...
                                { turtle | current = if left /= Nil then left else right }  -- Nilでない子どもに移動
        _ -> -- Running, Doneのときは何もしない(そもそもnextを呼ぶのはRunning, Done以外のときだが念のため)
            turtle

-- 命令フェッチ
run : Int -> Model -> ( Model, Cmd Msg )
run limit model =
    if limit <= 0 then
        ( model, proceed ) -- 制限に到達したら一度呼出しを抜けて再度runを呼びなおす
    else 
        case model.turtle.state of
            Running ->
                ( model, Cmd.none )
            Done    ->
                ( model, Cmd.none )
            _ -> -- stateがWaitingかStartのとき
                let
                    nextTurtle = next model.getASTRoots model.turtle
                    newTurtle =
                        case nextTurtle.current of
                            Nil ->
                                { nextTurtle | state = Done } -- 終了
                            AST node _ _ ->
                                case node.getBrickType of
                                    BasicBrick ->
                                        case node.getBrickCommand of
                                            CommandToioWait ->            -- 待機
                                                run_wait node.getText nextTurtle
                                            CommandToioMoveForward  ->    -- 前進
                                                run_forward True  node.getText nextTurtle
                                            CommandToioMoveBackward ->    -- 後退
                                                run_forward False node.getText nextTurtle
                                            CommandToioTurnLeft ->        -- 左回転
                                                run_turn False node.getText nextTurtle
                                            CommandToioTurnRight ->       -- 右回転
                                                run_turn True node.getText nextTurtle
                                            CommandPush ->
                                                run_push node.getText nextTurtle
                                            CommandPop ->
                                                run_pop node.getText nextTurtle
                                            CommandPenDown ->
                                                run_pen node.getText nextTurtle
                                            CommandPenUp ->
                                                run_pen node.getText nextTurtle
                                            CommandInit ->
                                                run_init node.getText nextTurtle
                                            CommandCalc ->
                                                run_calculate node.getText nextTurtle
                                            _ ->
                                                nextTurtle
                                    CaseBrick ->
                                                run_case node.getText nextTurtle
                                    _ -> -- Entry, Call, Spacerのときはすることなし
                                        nextTurtle
                in
                    case newTurtle.state of
                        Waiting ->
                            run (limit - 1) { model | turtle = newTurtle }
                        _ ->
                            ( { model | turtle = newTurtle }, Cmd.none )

-- 線分の終点を設定
setEndpoint : Float -> Float -> List String -> List String
setEndpoint x y lines =
    List.take (List.length lines - 2) lines ++ [String.fromFloat x, String.fromFloat y]


move_wait : Float -> Turtle -> Turtle
move_wait delta turtle =
    if turtle.wait_remaining > delta then
        { turtle | wait_remaining = turtle.wait_remaining - delta }

    else
        { turtle | wait_remaining = 0 }


move_forward : Float -> Turtle -> Turtle
move_forward delta turtle =
    if turtle.forward_remaining == 0 then
        turtle
    else
    if abs turtle.forward_remaining > abs (turtle.velocity * delta) then
        let
            newX = turtle.x + cos (degrees turtle.heading) * turtle.velocity * delta
            newY = turtle.y + sin (degrees turtle.heading) * turtle.velocity * delta
            newLines =
                if turtle.penState == Down then
                    setEndpoint (newX + turtle.w/2) (newY + turtle.w/2) turtle.lines
                else turtle.lines
        in
        { turtle
            | forward_remaining =
                turtle.forward_remaining - (turtle.velocity * delta)
            , x = newX
            , y = newY
            , lines = newLines
        }

    else
        let
            newX = turtle.x + cos (degrees turtle.heading) * turtle.forward_remaining
            newY = turtle.y + sin (degrees turtle.heading) * turtle.forward_remaining
            newLines =
                if turtle.penState == Down then
                    setEndpoint (newX + turtle.w/2) (newY + turtle.w/2) turtle.lines
                else turtle.lines
        in
        { turtle
            | forward_remaining = 0
            , x = turtle.x + cos (degrees turtle.heading) * turtle.forward_remaining
            , y = turtle.y + sin (degrees turtle.heading) * turtle.forward_remaining
            , lines = newLines
        }


move_turn : Float -> Turtle -> Turtle
move_turn delta turtle =
    if turtle.turn_remaining == 0 then
        turtle
    else
    if abs turtle.turn_remaining > abs (turtle.avelocity * delta) then
        { turtle
            | turn_remaining =
                turtle.turn_remaining  - (turtle.avelocity * delta)
            , heading = turtle.heading + (turtle.avelocity * delta)
        }

    else
        { turtle
            | turn_remaining = 0
            , heading = turtle.heading + turtle.turn_remaining
        }

-- run関数の再帰呼び出しの上限回数
runLimit : Int
runLimit = 1000

-- 仕事の実行
move : Float -> Model -> ( Model, Cmd Msg )
move delta model =
    let
        new_turtle =
            model.turtle
                -- 1tick分の仕事を実行
                |> move_wait    delta
                |> move_forward delta
                |> move_turn    delta
    in
    -- やり残しの仕事がなくなれば
    -- 次の命令を実行するためにWaiting状態に遷移
    if
        new_turtle.wait_remaining
            == 0
            && new_turtle.forward_remaining
            == 0
            && new_turtle.turn_remaining
            == 0
            && new_turtle.state
            == Running
    then
        ( { model | turtle =  { new_turtle | state = Waiting } }, proceed )
    else
        ( { model | turtle = new_turtle }, Cmd.none )


-- 変更の有無を表す型
-- 構文木（のリスト）に関する変更操作は一度に一ヶ所に限られるので
-- 変更の有無を追跡して処理を効率化するのに広く用いる
type Change a
    = Changed a
    | Unchanged a


-- 不要になった変更フラグを剥がす
discardC : Change a -> a
discardC cx =
    case cx of
        Changed x ->
            x
        Unchanged x ->
            x

{- 実際に使うのはアリティが1,2の場合だけなので適用的関手はオーバースペック
   コードも理解しにくくなるので、廃止して代わりにアリティが1,2のmapCを導入

-- Change型に対する適用的関手（多引数版のmapを実現）
-- 使用例:
-- absC x = if x > 0 then (Unchanged x) else (Changed -x)
-- Unchanged (+) |> andMapC (absC 1) |> andMapC (absC -2)  ==> (Changed 3)
-- Unchanged (+) |> andMapC (absC 1) |> andMapC (absC 2)   ==> (Unchanged 3)
andMapC : Change a -> Change (a -> b) -> Change b
andMapC ca cf =
    case ( ca, cf ) of
        ( Changed a, Changed f ) ->
            Changed (f a)
        ( Changed a, Unchanged f ) ->
            Changed (f a)
        ( Unchanged a, Changed f ) ->
            Changed (f a)
        ( Unchanged a, Unchanged f ) ->
            Unchanged (f a)
-}

-- Change型はファンクタ
mapC : (a -> b) -> Change a -> Change b
mapC f cx = case cx of
    (Changed x) ->
        Changed <| f x
    (Unchanged x) ->
        Unchanged <| f x

-- 2引数版
mapC2 : (a -> b -> c) -> Change a -> Change b -> Change c
mapC2 f cx cy = case (cx, cy) of
    (Changed x, Changed y) ->
        Changed <| f x y
    (Changed x, Unchanged y) ->
        Changed <| f x y
    (Unchanged x, Changed y) ->
        Changed <| f x y
    (Unchanged x, Unchanged y) ->
        Unchanged <| f x y

-- リストの要素のうち変更が必要なものが高々一つのケースを想定
-- Change型の値を返す関数fをリストxsの要素に適用
-- 変更があれば残りの要素への変更はスキップして効率化
-- 使用例:
-- changeOnce absC [1, -2, 3, -4, 5] ==> Changed [1, 2, 3, -4, 5]
-- changeOnce absC [1, 2, 3, 4, 5] ==> Unchanged [1, 2, 3, 4, 5]
changeOnce : (a -> Change a) -> List a -> Change (List a)
changeOnce f xs_ =
    case xs_ of
        [] ->
            Unchanged []
        x :: xs ->
            case f x of
                Changed a ->
                    Changed (a :: xs)
                Unchanged _ ->
                    mapC (\ys -> x :: ys) -- Haskellと違いelmは(x::)と書けない
                         (changeOnce f xs)


-- モデルに（根の位置情報付きの）ASTを追加
addASTxy : ASTxy Node -> Model -> Model
addASTxy astxy model =
    { model | getASTRoots = model.getASTRoots ++ [ astxy ] }


-- モデルから（根の位置情報付きの）ASTを削除
-- elmは参照透明なので等価性の判定は参照同値ではなく構造同値であることに注意
-- 実際は根の位置情報の食い違いで非等価がすぐに分かるのでAST全体を調べることはまれ
removeASTxy : ASTxy Node -> Model -> Model
removeASTxy astxy model =
    { model
        | getASTRoots =
            model.getASTRoots |> List.filter (\a -> a /= astxy)
    }


-- ドロップしたブリックの座標（x,y）が座標（x0,y0)のブリックの中かどうか判定
insideBrick : Position -> Position -> Bool
insideBrick ( x0, y0 ) ( x, y ) =
    y0 - mergin <= y && y <= y0 + mergin &&
    x0 - mergin <= x && x <= x0 + mergin


-- ドラッグアンドドロップ（DnD）の開始をモデルに記録
startDnD : Position -> Position -> Model -> Model
startDnD rootXY mouseXY model =
    { model | getDnDInfo = { getOnDnD = True, getMouseXY = mouseXY, getRootXY = rootXY },
              getASTRoots =
                  let
                    nonDnDRoots =
                        model.getASTRoots
                            |> List.filter (\(ASTxy p _) -> p /= rootXY)
                    theDnDRoot =
                        model.getASTRoots
                            |> List.filter (\(ASTxy p _) -> p == rootXY)
                  in
                      -- DnDの途中で重なった他のブロックにフォーカスをとられるバグへの対処
                      -- フォーカスされたブロックのASTがリストの最後にくるように並べ替え
                      -- これによりフォーカスされた（ドラッグ中の）ブロックが
                      -- 常にに最前面に表示される
                      nonDnDRoots ++ theDnDRoot
    }


-- ドラッグアンドドロップ（DnD）の終了をモデルに記録
stopDnD : Position -> Model -> Model
stopDnD ( rootX, rootY ) model =
    -- getMouseXY/getRootXY = (0, 0)は不要だが，デバッガで見やすいように0をセット
    { model | getDnDInfo = { getOnDnD = False
                           , getMouseXY = ( 0, 0 )
                           , getRootXY = (0, 0)
                           },
              -- ページ左端へのドラッグでブロック（木）を削除
              getASTRoots =
                  -- TODO: 150は適当な値、あとでちゃんとする
                  if rootX < 150 then
                      model.getASTRoots
                          |> List.filter (\(ASTxy p _) -> p /= ( rootX, rootY ))
                  else
                      model.getASTRoots
    }


-- サブASTの複製を追加
-- 純粋関数型言語であるElmではあらゆるデータは不変（persistent）なので
-- 実際にはASTの複製をつくる必要がないことに注意
-- 単にクリックしたマウスの座標情報を付加した上で元のサブASTを共有するだけ
-- でよいので非常に効率的で軽い処理
cloneUs : ASTxy Node -> Model -> Model
cloneUs (ASTxy ( x, y ) (ASTne newNode left right)) model =
    let
        isClonable = 
            newNode.getBrickType /= EntryBrick ||
            List.all ( \(ASTxy _ (ASTne node _ _)) -> (node /= newNode)) model.getASTRoots
    in
        if isClonable then
             model |> addASTxy (ASTxy (x + 10, y + 10) (ASTne newNode left right))
        else model


-- ASTの移動
-- 単に根の位置情報を変更するだけでよいので非常に軽い処理
moveUs : Position -> Model -> Model
moveUs ( mouseX, mouseY ) model =
    let
        (mouseX0, mouseY0) = model.getDnDInfo.getMouseXY

        (rootX0, rootY0) = model.getDnDInfo.getRootXY

        rootX = rootX0 + mouseX - mouseX0

        rootY = rootY0 + mouseY - mouseY0

        newInfo = { getOnDnD = True
                  , getMouseXY = ( mouseX, mouseY )
                  , getRootXY = ( rootX, rootY )
                  }
    in
        { model
            | getASTRoots =
                model.getASTRoots
                    |> List.reverse
                    |> changeOnce  -- changeOnceで変更を一ヵ所に限定
                            (\(ASTxy p a) ->
                                if p == (rootX0, rootY0) then
                                    Changed (ASTxy (rootX, rootY) a)
                                else Unchanged (ASTxy p a)
                            )
                    |> discardC
                    |> List.reverse
            , getDnDInfo = newInfo
    }


-- 変更箇所が1つだけであることを想定し
-- 関数funB, funRを非空ASTの両方（直下、直右）の部分木に対してそれぞれ呼び出す
-- このときChange型の情報を利用して必要なければ呼び出しをスキップ
fanOut :
    Magnitude
    -> (Position -> AST a -> Change (AST a))
    -> (Position -> AST a -> Change (AST a))
    -> Position
    -> ASTne a
    -> Change (ASTne a)
fanOut d funB funR ( x, y ) (ASTne n b r) =
    case funB ( x, y + d ) b of
        Changed newB ->
            mapC2 (ASTne n) (Changed newB) (Unchanged r)
        Unchanged _ ->
            mapC2 (ASTne n) (Unchanged b) (funR ( x + d, y ) r)


-- マウスでクリックした位置のブロックを根とするASTをモデルに追加する
letMeRoot : ASTxy Node -> Model -> Model
letMeRoot (ASTxy newRootXY _ as newRoot) model =
    let
        traverse xy ast =
            case ast of
                Nil ->
                    Unchanged Nil
                AST n b r ->
                    if insideBrick xy newRootXY then
                        Changed Nil  -- 部分ASTをNilで置換
                    else
                        mapC asAST <| fanOut (interval model)
                                             traverse
                                             traverse
                                             xy
                                             (ASTne n b r)
        newRoots =
            model.getASTRoots
                |> changeOnce
                    (\(ASTxy xy astne) ->
                        mapC (ASTxy xy) <| fanOut (interval model)
                                                  traverse
                                                  traverse
                                                  xy
                                                  astne
                    )
    in
        -- 念のためletMeRootが成功したことを確認した上でaddASTxyする
        case newRoots of
            Changed roots ->
                { model | getASTRoots = roots }
                    |> addASTxy newRoot
            Unchanged _ ->
                model


-- ASTを別のASTの葉に接木する
attachMe : ASTxy Node -> Model -> Model
attachMe (ASTxy rootXY (ASTne node _ _ as astne) as oldRoot) model =
    -- ドロップされたブロックがEntryBrickならアタッチしない（禁則）
    if node.getBrickType == EntryBrick then
        model
    else
        let
            -- ブロックnの下にアタッチできるかどうかを判定
            isAttachableB n r b =
                if n.getText == Space "right" || b.getText == Space "right"
                    then False
                else
                    n.getBrickType == CaseBrick ||
                    r == Nil

            -- ブロックnの右にアタッチできるかどうかを判定
            isAttachableR n b r =
                if n.getText == Space "down" || r.getText == Space "down"
                    then False
                else
                    n.getBrickType == CaseBrick ||
                    b == Nil

            -- アタッチが許容されるかどうかの判定は親ノードでおこない
            -- 判定結果を引数attachableで子ノードに伝搬
            traverse attachable xy ast =
                case ast of
                    Nil ->
                        -- アタッチ許容位置でリリースされたときにはアタッチを実行
                        if attachable && insideBrick xy rootXY then
                            Changed <| asAST <| astne
                        else
                            Unchanged Nil
                    AST n b r ->
                        mapC asAST <|
                             fanOut (interval model)
                                    (traverse (isAttachableB n r node))
                                    (traverse (isAttachableR n b node))
                                    xy
                                    (ASTne n b r)

            newRoots =
                model.getASTRoots
                    |> changeOnce
                        (\(ASTxy xy (ASTne n b r as ast)) ->
                            mapC (ASTxy xy) <|
                                 fanOut (interval model)
                                        (traverse (isAttachableB n r node))
                                        (traverse (isAttachableR n b node))
                                        xy
                                        ast
                        )
        in
        -- 接木が成功したことを確認したときだけリストから削除する
        case newRoots of
            Changed roots ->
                { model | getASTRoots = roots }
                    |> removeASTxy oldRoot
            Unchanged _ ->
                model

--文字列からオペレータに直す関数
stringToOp : String -> Maybe Operator
stringToOp str =
    case str of
        "Add"      -> Just Add
        "Sub"      -> Just Sub
        "Mul"      -> Just Mul
        "Div"      -> Just Div
        "Quotient" -> Just Quotient
        "Mod"      -> Just Mod
        _          -> Nothing --使用箇所的にここを通ることはあり得ないけど念のため

--オペレータから文字列に直す関数
opToString : Operator -> String
opToString op =
    case op of
        Add      -> "Add"
        Sub      -> "Sub"
        Mul      -> "Mul"
        Div      -> "Div"
        Quotient -> "Quotient"
        Mod      -> "Mod"

--文字列からコンパレータに直す関数
stringToCp : String -> Maybe Comparator
stringToCp str =
    case str of
        "Eq"  -> Just Eq
        "Ne"  -> Just Ne
        "Gt"  -> Just Gt
        "Lt"  -> Just Lt
        "Ge"  -> Just Ge
        "Le"  -> Just Le
        _     -> Nothing --使用箇所的にここを通ることはあり得ないけど念のため

--コンパレータから文字列に直す関数
cpToString : Comparator -> String
cpToString cp =
    case cp of
        Eq  -> "Eq"
        Ne  -> "Ne"
        Gt  -> "Gt"
        Lt  -> "Lt"
        Ge  -> "Ge"
        Le  -> "Le"


-- 許容される文字列の種類に応じて文字列を更新する関数
-- 前の文字列, 変更後の文字列, 型判定関数のリストを受け取り, 関数が1つでもTrueを返すなら文字列を更新
strictType : String -> String -> List (String -> Bool) -> String
strictType old new list =
    if List.any (\f -> f new) list then new
    else old


-- 入力されたデータがFloatかどうか判定する関数
-- 文字列が空ならTrueを返す
isFloat : String -> Bool
isFloat str =
    case String.toFloat str of
        Just _  -> 
            True
        Nothing ->
            case str of
                "-" ->  -- 「-」だけの入力もOkだが空欄であることと同じ扱いになる
                    True
                _ ->
                    String.isEmpty str

-- 入力された文字列がStringかどうか判定する関数
 --この段階では先頭が「"」ではじまってさえいればOK(末尾はまだチェックしない)
-- 文字列が空ならTrueを返す
isString : String -> Bool
isString str = 
    String.startsWith "\"" str || String.isEmpty str

-- 入力された文字列が変数名かどうか判定する関数
-- アルファベットから始まり, アルファベットと数字以外が使われていないなら変数名であると判定
-- 文字列が空ならTrueを返す
isVariable : String -> Bool
isVariable str =
    let
        isInitAlpha =
            case String.uncons str of
                Just  (c, _) ->
                    Char.isAlpha c
                Nothing ->
                    False
    in
        isInitAlpha && String.all Char.isAlphaNum str ||
        String.isEmpty str


modifyName : Text -> Int -> String -> Text
modifyName text place new =
    case text of
        Name _ ->
            case place of
                1 ->
                    Name new
                _ ->
                    text
        _ ->
            text

modifyParam : Text -> Int -> String -> Text
modifyParam text place new =
    case text of
        Param val ->
            case place of
                1 ->
                    Param (strictType val new [isFloat, isVariable])
                _ ->
                    text
        _ ->
            text

-- Initの指定されたデータを更新する関数
modifyInit : Text -> Int -> String -> Text
modifyInit text place new =
    case text of
        Init var val ->
            case place of
                1 ->
                    Init (strictType var new [isVariable]) val
                2 ->
                    Init var (strictType val new [isFloat, isString, isVariable])
                _ ->
                    text
        _ -> text

-- Calcの指定されたデータを更新する関数
modifyCalc : Text -> Int -> String -> Text
modifyCalc text place new =
    case text of
        Calc var val1 op val2 ->
            case place of
                1 ->
                    Calc (strictType var new [isVariable]) val1 op val2
                2 ->
                    Calc var (strictType val1 new [isFloat, isVariable]) op val2
                3 ->
                    case stringToOp new of
                        Just newOp -> Calc var val1 newOp val2
                        Nothing    -> text
                4 ->
                    Calc var val1 op (strictType val2 new [isFloat, isVariable])
                _ ->
                    text
        _ -> text

-- Condの指定されたデータを更新する関数
modifyCond : Text -> Int -> String -> Text
modifyCond text place new =
    case text of
        Cond val1 cp val2 ->
            case place of
                1 -> 
                    Cond (strictType val1 new [isFloat, isString, isVariable]) cp val2
                2 ->
                    case stringToCp new of
                        Just newCp -> Cond val1 newCp val2
                        Nothing    -> text
                3 ->
                    Cond val1 cp (strictType val2 new [isFloat, isString, isVariable])
                _ ->
                    text
        _ -> text

modifyPush : Text -> Int -> String -> Text
modifyPush text place new =
    case text of
        Push val ->
            case place of
                1 ->
                    Push (strictType val new [isFloat, isString, isVariable])
                _ ->
                    text
        _ ->
            text

modifyPop : Text -> Int -> String -> Text
modifyPop text place new =
    case text of
        Pop var ->
            case place of
                1 ->
                    Pop (strictType var new [isVariable])
                _ ->
                    text
        _ ->
            text


-- Text型の指定したデータを更新する関数
modifyTextData : Text -> Int -> String -> Text
modifyTextData text place new =
    case text of
        Name _         -> modifyName text place new
        Param _        -> modifyParam text place new
        Init  _ _      -> modifyInit text place new
        Calc  _ _ _ _  -> modifyCalc text place new
        Cond  _ _ _    -> modifyCond text place new
        Push  _        -> modifyPush text place new
        Pop   _        -> modifyPop  text place new
        _              -> text



-- Text型の指定したデータが「"」で囲まれるよう修正する関数
completeDblquote : Text -> Int -> String -> Text
completeDblquote text place new =
    let
        -- 末尾の「"」を補う関数
        dblquote str =
            if not (String.startsWith "\"" str) 
                then str --文字列でない場合or文字列が空の場合は何もしない
            else if str == "\"" 
                then "\"\"" --「"」のときは「""」に直す
            else if not (String.endsWith "\"" str)
                then str ++ "\"" --末尾の「"」が欠けているなら補う
            else str
    in
        case text of
            Init var val -> 
                case place of
                    2 -> Init var (dblquote new)
                    _ -> text 
            Cond val1 cp val2 -> 
                case place of
                    1 -> Cond (dblquote new) cp val2
                    3 -> Cond val1 cp (dblquote new)
                    _ -> text
            Push val ->
                case place of
                    1 -> Push (dblquote new)
                    _ -> text
            _ -> text


-- 先頭と末尾の「"」を外す関数
deleteDblquote : String -> String
deleteDblquote str =
    if String.startsWith "\"" str &&
       String.endsWith   "\"" str &&
       String.length str >= 2   then
        str |> String.dropLeft 1 |> String.dropRight 1
    else str


-- 再度, 引数に関数(modifyTextData or completeDblquote)をわたすよう変更 (やっぱり無駄な引数があるのでまたもどすかもしれない)
modifyText : (Text -> Int -> String -> Text) -> Position -> Int -> String -> Model -> Model
modifyText func theXY place newText model =
    let
            traverse xy ast =
                case ast of
                    Nil ->
                        Unchanged Nil
                    AST n b r ->
                        if insideBrick xy theXY then
                            Changed (AST { n | getText = func n.getText place newText } b r)
                        else
                            mapC asAST <| fanOut (interval model)
                                                 traverse
                                                 traverse
                                                 xy
                                                 (ASTne n b r)

        in
            { model
                | getASTRoots =
                    model.getASTRoots
                        |> changeOnce
                            (\(ASTxy xy (ASTne n b r as ast)) ->
                                if insideBrick xy theXY then
                                    Changed (ASTxy xy (ASTne { n | getText = func n.getText place newText } b r))
                                else
                                    mapC (ASTxy xy) <| fanOut (interval model)
                                                              traverse
                                                              traverse
                                                              xy
                                                              ast
                            )
                        |> discardC
            }


-- modifyString : Position -> Int -> Model -> Model
-- modifyString theXY place model =
--     let
--             traverse xy ast =
--                 case ast of
--                     Nil ->
--                         Unchanged Nil
--                     AST n b r ->
--                         if insideBrick xy theXY then
--                             Changed (AST { n | getText = completeDblquote n.getText place } b r)
--                         else
--                             mapC asAST <| fanOut (interval model)
--                                                  traverse
--                                                  traverse
--                                                  xy
--                                                  (ASTne n b r)

--         in
--             { model
--                 | getASTRoots =
--                     model.getASTRoots
--                         |> changeOnce
--                             (\(ASTxy xy (ASTne n b r as ast)) ->
--                                 if insideBrick xy theXY then
--                                     Changed (ASTxy xy (ASTne { n | getText = completeDblquote n.getText place } b r))
--                                 else
--                                     mapC (ASTxy xy) <| fanOut (interval model)
--                                                               traverse
--                                                               traverse
--                                                               xy
--                                                               ast
--                             )
--                         |> discardC
--             }


-- VIEW


-- ブリック要素は入れ子の木になっているので伝搬を止めないと複数のブリックが
-- イベントを複数ひろってしまうので、stepPropagationは常にTrue
on : String -> Decoder msg -> Attribute msg
on eventName =
    Decode.map (\m -> { message = m
                      , stopPropagation = True
                      , preventDefault = False
                      })
        >> Html.Events.custom eventName


getASTVars : AST Node -> List String
getASTVars ast =
    case ast of
        Nil ->
            []
        AST node left right ->
            let
                varName =
                    case node.getText of
                        Init var _     -> [var]
                        Calc var _ _ _ -> [var]
                        Pop  var       -> [var]
                        _              -> []
                leftVarNames  = getASTVars left
                rightVarNames = getASTVars right
            in
                varName ++ leftVarNames ++ rightVarNames


getVarNames : Model -> Model
getVarNames model =
    let
        varList =
            List.foldl 
                (\(ASTxy _ astne) list ->
                    list ++ (getASTVars <| asAST <| astne)
                )
                []
                model.getASTRoots
    in
        { model | varNames = Set.fromList varList }


preventDefaultOn : String -> Decoder msg -> Attribute msg
preventDefaultOn eventName =
    Decode.map (\m -> { message = m
                      , stopPropagation = True
                      , preventDefault = True
                      })
        >> Html.Events.custom eventName


whenLeftButtonIsDown : Decoder a -> Decoder a
whenLeftButtonIsDown decoder =
    Decode.when
        (Decode.field "button" Decode.int)
        (\button -> button == 0)
        decoder


whenRightButtonIsDown : Decoder a -> Decoder a
whenRightButtonIsDown decoder =
    Decode.when
        (Decode.field "button" Decode.int)
        (\button -> button == 2)
        decoder


whenDragging : Model -> Decoder a -> Decoder a
whenDragging model decoder =
    Decode.when
        (Decode.succeed 0)
        (\_ -> model.getDnDInfo.getOnDnD)
        decoder


whenNotDragging : Model -> Decoder a -> Decoder a
whenNotDragging model decoder =
    Decode.when
        (Decode.succeed 0)
        (\_ -> not model.getDnDInfo.getOnDnD)
        decoder


view : Model -> Html Msg
view model =
    div
        [ class "columns"
        -- mousemove
        -- mousemoveイベントはフォーカスされたブロックではなくviewのルートで捕獲
        -- このほうが激しくムーブしてポインタがブロックからはずれたときにも正しく動く
        -- 寺尾くんがゼミBで発見したアイデアを採用
        -- ブロック表面の画像だけがドラッグされないようにpreventDefaultが必要
        , preventDefaultOn "mousemove"
              <| whenDragging model
                  <| Decode.map2
                         (\pageX pageY -> MsgMoveUs ( pageX, pageY ))
                         (Decode.field "pageX" Decode.float)
                         (Decode.field "pageY" Decode.float)


        -- 追加
        -- touchmove
        , preventDefaultOn "touchmove"
            <| whenDragging model
                <| Decode.map2
                    (\clientX clientY -> MsgMoveUs (clientX, clientY))
                    (Decode.at ["changedTouches", "0", "clientX"] Decode.float)
                    (Decode.at ["changedTouches", "0", "clientY"] Decode.float)

        
        ]
        [ div
            [ class "column is-one-quarter"
            , style "background-color" "orange"
            ]
            [ div
                [ style "height" "3000px" ]  -- "100%"ではだめ
                []
            , Keyed.node "div"
                []
                (pallet
                    |> List.map createNewRoot
                    |> List.indexedMap
                        (\index astxy -> ( String.fromInt index
                                         , viewASTRoot model astxy
                                         )
                        )
                )
            ]
        , Keyed.node "div"
            [ class "column"
            , style "background-color" "lightgray"
            ]
            (model.getASTRoots
                |> List.indexedMap
                    (\index astxy -> ( String.fromInt index
                                     , viewASTRoot model astxy
                                     )
                    )
            )
        , div
            [ class "column is-one-quarter"
            , style "background-color" "skyblue"
            ]
            [ div   -- このあたりは適当に設定している
                [ style "position" "relative"
                , style "top" "10px"
                ]
                [ div
                    []
                    [ button
                        [ Decode.succeed MsgDownload |> on "click" ]
                        [ text "プログラムを保存"]
                    , button
                        [ Decode.succeed MsgRequested |> on "click" ]
                        [ text "プログラムを読み込み"]
                    ]
                , viewTurtle model.turtle
                , div
                    []
                    [ input
                        [ style "width" "150px"
                        , placeholder "マーカス" --新しい関数名
                        , value model.routineBox
                        , hidden False
                        , (Decode.map MsgRoutineBoxChanged targetValue) |> on "input"
                        ] []
                    , text model.routineBox
                    , button
                        [ Decode.succeed MsgMakeNewRoutine |> on "click" ]
                        [ text "つくる" ]
                    
                    , text (String.fromInt (List.length model.turtle.callStack)) -- デバッグ用 消してOK
                    ]
                , div
                    []
                    [ text "最初のx座標 : " 
                    , input
                      [ style "width" "50px"
                        --, placeholder "さいしょのx座標"
                        , value model.initXBox
                        , hidden False
                        , (Decode.map MsgInitXChanged targetValue) |> on "input"
                        , (Decode.succeed MsgInitXBlur) |> on "blur"
                        ] []
                    ]
                , div
                    []
                    [ text "さいしょのy座標 : "
                    , input
                      [ style "width" "50px"
                        --, placeholder "さいしょのy座標"
                        , value model.initYBox
                        , hidden False
                        , (Decode.map MsgInitYChanged targetValue) |> on "input"
                        , (Decode.succeed MsgInitYBlur) |> on "blur"
                        ] []
                    ]
                , div
                    []
                    [ text "さいしょの向き \u{00a0}\u{00a0}: "
                    , input
                      [ style "width" "50px"
                        --, placeholder "さいしょの角度"
                        , value model.initHeadingBox
                        , hidden False
                        , (Decode.map MsgInitHeadingChanged targetValue) |> on "input"
                        , (Decode.succeed MsgInitHeadingBlur) |> on "blur"
                        ] []
                    ]
                ]
            ]
        ]


-- 根のブロックの描画
viewASTRoot : Model -> ASTxy Node -> Html Msg
viewASTRoot model (ASTxy ( x, y ) (ASTne n b r) as root) =
    Keyed.node "div"
        [ style "position" "absolute"
        , style "top" (String.fromFloat y ++ "px")
        , style "left" (String.fromFloat x ++ "px")
        -- mouseup
        , on "mouseup"
              <| whenDragging model
                  <| whenLeftButtonIsDown
                      <| Decode.succeed
                          <| MsgAttachMe root

        -- 追加
        -- touchend
        , preventDefaultOn "touchend"
              <| whenDragging model
                    <| Decode.succeed
                        <| MsgAttachMe root


        -- mousedown
        , on "mousedown"
              <| whenNotDragging model
                  <| whenLeftButtonIsDown
                      -- MsgLetMeRootは根には無意味、代わりにMsgStartDnDを単独でセット
                      <| Decode.map2
                             (\pageX pageY -> MsgStartDnD ( x, y ) ( pageX, pageY ))
                             (Decode.field "pageX" Decode.float)
                             (Decode.field "pageY" Decode.float)

        -- touchstart
        , on "touchstart"
            <| whenNotDragging model
                <| Decode.map2
                    (\clientX clientY -> 
                        Debug.log "Touch start detected"
                        MsgStartDnD (x, y) (clientX, clientY)
                    )
                    (Decode.at ["changedTouches", "0", "clientX"] Decode.float)
                    (Decode.at ["changedTouches", "0", "clientY"] Decode.float)


        -- contextmenu
        -- コンテクストメニューが開かないようにpreventDefaultが必要
        , preventDefaultOn "contextmenu"
              <| whenNotDragging model
                  <| whenRightButtonIsDown
                      <| Decode.succeed
                          <| MsgCloneUs (ASTxy ( x, y ) (ASTne n b r))
        -- dblclick
        , on "dblclick"
              <| whenLeftButtonIsDown
                  <| Decode.succeed MsgDblClick



        -- Duplicate: 2本指のタッチで複製
        , preventDefaultOn "Duplicate"
              <| whenNotDragging model
                  <| Decode.andThen
                      (\event ->
                          case Decode.decodeValue decodeTouches event of
                              Ok touches ->
                                  let
                                      touchCount = List.length touches
                                  in
                                  if touchCount == 2 then
                                      -- デバッグログ: タッチ数を表示
                                      Debug.log "2本指のタッチ検出" touchCount
                                      -- 複製メッセージを送信
                                      |> (\_ -> Decode.succeed (MsgCloneUs root))
                                  else
                                      Decode.succeed MsgNoOp
                              Err err ->
                                  -- エラーログ
                                  Debug.log "Failed to decode touches" err
                                  |> (\_ -> Decode.succeed MsgNoOp)
                      )
                      Decode.value -- イベント全体を取得

        ]
        [ ( "N", lazy3 viewBrick model ( x, y ) n)
        , ( "R", lazy4 viewAST model ( x + interval model, y ) ToRight r )
        , ( "B", lazy4 viewAST model (x, y + interval model ) ToBottom b )
        ]

-- 2本指のタッチイベントをデコード
decodeTouches : Decode.Decoder (List (Float, Float))
decodeTouches =
    Decode.field "changedTouches"
        (Decode.list
            (Decode.map2 (\clientX clientY -> (clientX, clientY))
                (Decode.field "clientX" Decode.float)
                (Decode.field "clientY" Decode.float)
            )
        )



-- 根以外の木の再帰的描画
viewAST : Model -> Position -> Direction -> AST Node -> Html Msg
viewAST model ( x, y ) direction ast =
    case ast of
        Nil ->
            div [] []
        AST n b r ->
            Keyed.node "div"
                [ style "position" "absolute"
                , style "top" <|
                    case direction of
                        ToRight ->
                            "0px"
                        ToBottom ->
                            String.fromFloat (interval model) ++ "px"
                , style "left" <|
                    case direction of
                        ToBottom ->
                            "0px"
                        ToRight ->
                            String.fromFloat (interval model) ++ "px"
                -- mousedown
                , on "mousedown"
                      <| whenNotDragging model
                          <| whenLeftButtonIsDown
                              <| Decode.map4
                                  (\pageX pageY offsetX offsetY ->
                                      let
                                          -- boudingX/Yの計算でもclientX/YではなくpageX/Yを使用
                                          -- するよう変更（Thanks: 山中君）
                                          -- 変数名mouseX/YもpageX/Yに変更
                                          boundingX = pageX - offsetX
                                          boundingY = pageY - offsetY
                                      in
                                          -- Inputフォームのmouseclickが捕獲されなくなるバグへの
                                          -- ワークアラウンド。( boundingX, boundingY )がブロックの左上
                                          -- のときだけMsgLetMeRootを発行する。そうでなくて
                                          -- Inputフォームの左上のときはletMeRootが実行されることは
                                          -- なくなるので、Inputフォームのmouseclickイベントが正しく
                                          -- 処理されるようになる。
                                          if insideBrick ( x, y ) ( boundingX, boundingY )
                                          then MsgLetMeRoot
                                                   (ASTxy ( x, y ) (ASTne n b r))
                                                   ( pageX, pageY )
                                          else MsgNOP
                                  )
                                  (Decode.field "pageX" Decode.float)
                                  (Decode.field "pageY" Decode.float)
                                  -- 以下はターゲットがInputフォームかどうかの判定の計算にのみ使用
                                  (Decode.field "offsetX" Decode.float)
                                  (Decode.field "offsetY" Decode.float)
                -- contextmenu
                -- コンテクストメニューが開かないようにpreventDefaultが必要
                , preventDefaultOn "contextmenu"
                      <| whenNotDragging model
                          <| whenRightButtonIsDown
                              <| Decode.succeed
                                  <| MsgCloneUs (ASTxy ( x, y ) (ASTne n b r))



                ]
                [ ( "N", lazy3 viewBrick model ( x, y ) n ) -- 実際のブロックの描画はviewBrickで
                , ( "R", lazy4 viewAST model ( x + interval model, y ) ToRight r )
                , ( "B", lazy4 viewAST model ( x, y + interval model ) ToBottom b )
                ]


viewDataList : String -> Html Msg
viewDataList str =
    option [value str] [text str]

viewDropDown : String -> String -> Html Msg
viewDropDown select str =
    option [value str, selected (str == select) ][text str]



-- 実際に各々のブロックを描く関数
--  【エラー】blurイベントを取る入力ボックス(変数定義ブロックの右辺や条件分岐ブロックの右辺・左辺など)からフォーカスを外すと同時に, 
--           そのブロックの先祖要素?が変化する(なくなる?)とき(=そのブロックを親のブロックから分離するときなど...)にエラーが発生する模様.
--         　Failed to execute 'replaceChild' on 'Node': The node to be removed is no longer a child of this node. Perhaps it was moved in a 'blur' event handler?
viewBrick : Model -> Position -> Node -> Html Msg
viewBrick model xy node =
    let
        viewBrickPath =
            case node.getBrickType of
                EntryBrick ->
                    "M 320.0663 400 C 320.53105 393.00195 323.4379 386.13573 328.78682 380.7868 C 340.50254 369.07104 359.49746 369.07104 371.2132 380.7868 C 376.5621 386.13573 379.46895 393.00195 379.9337 400 L 490 400 C 495.52285 400 500 395.52285 500 390 L 500 279.9337 C 491.6702 280.48686 483.15363 277.58003 476.7868 271.21318 C 465.07104 259.49746 465.07104 240.50254 476.7868 228.78682 C 483.15363 222.41997 491.6702 219.51314 500 220.06632 L 500 110 C 500 104.47715 495.52285 100 490 100 L 210 100 C 204.47715 100 200 104.47715 200 110 L 200 390 C 200 395.52285 204.47715 400 210 400 Z"
                SpacerBrick ->
                    case node.getText of
                        Space "right" ->
                            "M 500 220.0663 L 500 110 C 500 104.4771 495.5229 100 490 100 L 379.9337 100 L 320.0663 100 L 210 100 C 204.4771 100 200 104.4771 200 110 L 200 220.0663 C 191.6702 219.5131 183.1536 222.42 176.7868 228.7868 C 165.071 240.5025 165.071 259.4975 176.7868 271.2132 C 183.1536 277.58 191.6702 280.4869 200 279.9337 L 200 390 C 200 395.5229 204.4771 400 210 400 L 320.0663 400 L 490 400 C 495.5229 400 500 395.5229 500 390 L 500 279.9337 C 491.6702 280.4869 483.1536 277.58 476.7868 271.2132 C 465.071 259.4975 465.071 240.5025 476.7868 228.7868 C 483.1536 222.42 491.6702 219.5131 500 220.0663 Z"
                        _  ->
                            "M 500 220.0663 L 500 110 C 500 104.4771 495.5229 100 490 100 L 379.9337 100 C 379.469 93.0019 376.5621 86.1357 371.2132 80.7868 C 359.4975 69.071 340.5025 69.071 328.7868 80.7868 C 323.4379 86.1357 320.531 93.0019 320.0663 100 L 320.0663 100 L 210 100 C 204.4771 100 200 104.4771 200 110 L 200 220.0663 L 200 390 C 200 395.5229 204.4771 400 210 400 L 320.0663 400 C 320.531 393.002 323.4379 386.1357 328.7868 380.7868 C 340.5025 369.071 359.4975 369.071 371.2132 380.7868 C 376.5621 386.1357 379.469 393.002 379.9337 400 L 490 400 C 495.5229 400 500 395.5229 500 390 L 500 279.9337 Z"
                _ ->
                    "M 500 220.06632 L 500 110 C 500 104.47715 495.52285 100 490 100 L 379.9337 100 C 379.46895 93.00195 376.5621 86.13573 371.2132 80.78682 C 359.49746 69.07104 340.50254 69.07104 328.78682 80.78682 C 323.4379 86.13573 320.53105 93.00195 320.0663 100 L 320.0663 100 L 210 100 C 204.47715 100 200 104.47715 200 110 L 200 220.06632 C 191.6702 219.51314 183.15363 222.41997 176.78682 228.78682 C 165.07104 240.50254 165.07104 259.49746 176.78682 271.21318 C 183.15363 277.58003 191.6702 280.48686 200 279.9337 L 200 390 C 200 395.52285 204.47715 400 210 400 L 320.0663 400 C 320.53105 393.00195 323.4379 386.13573 328.78682 380.7868 C 340.50254 369.07104 359.49746 369.07104 371.2132 380.7868 C 376.5621 386.13573 379.46895 393.00195 379.9337 400 L 490 400 C 495.52285 400 500 395.52285 500 390 L 500 279.9337 C 491.6702 280.48686 483.15363 277.58003 476.7868 271.21318 C 465.07104 259.49746 465.07104 240.50254 476.7868 228.78682 C 483.15363 222.41997 491.6702 219.51314 500 220.06632 Z"
        color =
            case node.getBrickType of
                BasicBrick ->
                    "yellow"
                EntryBrick ->
                    "pink"
                CallBrick ->
                    "skyblue"
                CaseBrick ->
                    "limegreen"
                SpacerBrick ->
                    "white"
        image =
            "dist/assets/" ++
            case node.getBrickType of
                BasicBrick ->
                   if node.getBrickCommand == CommandToioMoveForward
                       then "toio_forward.png"
                       else "toio_turn_left.png"
                EntryBrick ->
                   if node.getText == Name "usagi"
                       then "begin_usagi.png"
                       else "begin_kuma.png"
                CallBrick ->
                   if node.getText == Name "usagi"
                       then "end_usagi.png"
                       else "end_kuma.png"
                CaseBrick ->
                   "snoopy.png"
                SpacerBrick ->
                    "" -- まだ画像は用意してないので未定
    in
    div
        []
        [ svg
            [ width  <| String.fromFloat model.getBrickSize
            , height <| String.fromFloat model.getBrickSize
            , viewBox "166 70 336 336"
            ]
            [ path
                [ d viewBrickPath
                , stroke "gray"
                , fill color
                , strokeWidth "6"
                ]
                []
            ]
        , if (node.getBrickType == EntryBrick || node.getBrickType == CallBrick) &&
             (node.getText == Name "usagi" || node.getText == Name "kuma") then
           img
            [ src image
            , width "100"
            , height "100"
            , style "position" "absolute"
            , style "pointer-events" "none" -- これがないとブロック上の画像がイベントをひろってしまう
            , style "margin" "15px 15px"
            , class "image is-overray" -- Bulma必須
            , style "top" "0%" -- Bulma必須
            , style "left" "0%" -- Bulma必須
            ]
            []
          else div [] []
        , i
            [ style "position" "absolute"
            , style "pointer-events" "none"
            , style "top" "20%"
            , style "left" "20%"
            , style "color" "gray"
            , class <| case node.getBrickType of
                           CaseBrick -> "fas fa-question fa-3x"
                           BasicBrick ->
                               case node.getBrickCommand of
                                   CommandToioMoveForward     -> "fas fa-long-arrow-alt-right fa-4x"
                                   CommandToioMoveBackward    -> "fas fa-long-arrow-alt-left fa-4x"
                                   CommandToioTurnLeft        -> "fas fa-undo-alt fa-3x faa-spin animated"
                                   CommandToioTurnRight       -> "fas fa-redo-alt fa-3x faa-spin animated"
                                   CommandToioPlayPresetSound -> "fas fa-volume-up fa-5x"
                                   CommandPush                -> "fas fa-sign-in-alt fa-3x fa-rotate-90"
                                   CommandPop                 -> "fas fa-sign-out-alt fa-3x fa-rotate-270"
                                   CommandPenDown             -> "fas fa-pencil-alt fa-3x"
                                   CommandPenUp               -> "fas fa-pencil-alt fa-3x"
                                   _ -> ""
                           SpacerBrick -> 
                                if node.getText == Space "right" then "far fa-hand-point-right fa-5x"
                                else "far fa-hand-point-down fa-5x"
                           _ -> ""
            ] []
        , case node.getText of
            Pen penState ->
                i
                    [ style "position" "absolute"
                    , style "pointer-events" "none"
                    , style "top" "45%"
                    ,style "left" "45%"
                    , style "color" "gray"
                    , class <| case penState of
                                    Down -> "fas fa-arrow-down fa-3x"
                                    Up   -> "fas fa-arrow-up   fa-3x"
                    ] []
            _ ->
                i [][]
        , case node.getText of
            Name str ->
                case node.getBrickType of
                    EntryBrick -> -- EntryブロックのときはTextを変更させない(関数定義が2個以上存在すると困るので)
                        div [ style "position" "absolute"
                            , style "top" "10%"
                            , style "left" "20%"
                            ]
                            [ text str ]
                    CallBrick -> -- CallブロックのときはドロップダウンでTextを変更可能
                        select
                            [ (Decode.map (MsgInputChanged xy 1) targetValue) |> on "change"
                            , style "position" "absolute"
                            , style "top" "10%"
                            , style "left" "20%"
                            , style "width" "60px"
                            ]
                            (List.map (viewDropDown str) (Set.toList model.routineNames))
                    _ ->
                        div [][]
            Param val ->
                if node.getBrickCommand == CommandToioPlayPresetSound then
                    div[][] -- 音ブロックはまだ未実装なので入力ボックスなし
                else
                div []
                    [
                      input
                        [ style "position" "absolute"
                        , style "top" "65%"
                        , style "left" "20%"
                        , style "width" "60px"
                        , value <| val
                        , hidden False
                        , (Decode.map (MsgInputChanged xy 1) targetValue) |> on "input"
                        , (Decode.succeed MsgSetVarNames) |> on "focus"
                        , list "Param"
                        ] []
                    , datalist
                        [id "Param"] (List.map viewDataList (Set.toList model.varNames))
                     , div [ style "position" "absolute"
                           , style "top" "63%"
                           , style "left" "70%"
                           ]
                           [ text 
                                (case node.getBrickCommand of
                                    CommandToioMoveForward  -> "px"
                                    CommandToioMoveBackward -> "px"
                                    CommandToioTurnLeft     -> "度"
                                    CommandToioTurnRight    -> "度"
                                    _                       -> ""
                                )
                           ]
                    ]
            Init var val ->
                div []
                    [
                    input
                        [ style "position" "absolute"
                        , style "top" "65%"
                        , style "left" "15%"
                        , style "width" "30px"
                        , value <| var
                        , hidden False
                        , (Decode.map (MsgInputChanged xy 1) targetValue) |> on "input"
                        ] []
                    , div [ style "position" "absolute"
                          , style "top" "65%"
                          , style "left" "40%"
                          ]
                          [text "="]
                    , input
                        [ style "position" "absolute"
                        , style "top" "65%"
                        , style "left" "50%"
                        , style "width" "55px"
                        , value <| val
                        , hidden False
                        , (Decode.map (MsgInputChanged xy 2) targetValue) |> on "input"
                        , (Decode.map (MsgCheckString  xy 2) targetValue) |> on "blur"
                        , (Decode.succeed MsgSetVarNames) |> on "focus"
                        , list "Init"
                        ] []
                    , datalist
                        [id "Init"] (List.map viewDataList (Set.toList model.varNames))
                    ]
            Calc var val1 op val2 ->
                div []
                    [
                    input
                        [ style "position" "absolute"
                        , style "top" "35%"
                        , style "left" "20%"
                        , style "width" "45px"
                        , value <| var
                        , hidden False
                        , (Decode.map (MsgInputChanged xy 1) targetValue) |> on "input"
                        ] []
                    , div [ style "position" "absolute"
                          , style "top" "35%"
                          , style "left" "60%"
                          ]
                          [text "="]
                    , input
                        [ style "position" "absolute"
                        , style "top" "65%"
                        , style "left" "13%"
                        , style "width" "37px"
                        , value <| val1
                        , hidden False
                        , (Decode.map (MsgInputChanged xy 2) targetValue) |> on "input"
                        , (Decode.succeed MsgSetVarNames) |> on "focus"
                        , list "Calc2"
                        ] []
                    , datalist
                        [id "Calc2"] (List.map viewDataList (Set.toList model.varNames))
                    , select
                        [ (Decode.map (MsgInputChanged xy 3) targetValue) |> on "change"
                        , style "position" "absolute"
                        , style "top" "65%"
                        , style "left" "43%"
                        , style "width" "33px"
                        ]  
                        [ option [ value "Add",      selected (op == Add)      ] [ text "+"  ]
                        , option [ value "Sub",      selected (op == Sub)      ] [ text "-"  ]
                        , option [ value "Mul",      selected (op == Mul)      ] [ text "*"  ]
                        , option [ value "Div",      selected (op == Div)      ] [ text "/"  ]
                        , option [ value "Quotient", selected (op == Quotient) ] [ text "//" ]
                        , option [ value "Mod",      selected (op == Mod)      ] [ text "%"  ]
                        ]
                    , input
                        [ style "position" "absolute"
                        , style "top" "65%"
                        , style "left" "70%"
                        , style "width" "35px"
                        , value <| val2
                        , hidden False
                        , (Decode.map (MsgInputChanged xy 4) targetValue) |> on "input"
                        , (Decode.succeed MsgSetVarNames) |> on "focus"
                        , list "Calc4"
                        ] []
                    , datalist
                        [id "Calc4"] (List.map viewDataList (Set.toList model.varNames))
                    ]
            Cond val1 cp val2 ->
                div []
                    [
                    input
                        [ style "position" "absolute"
                        , style "top" "65%"
                        , style "left" "13%"
                        , style "width" "34px"
                        , value <| val1
                        , hidden False
                        , (Decode.map (MsgInputChanged xy 1) targetValue) |> on "input"
                        , (Decode.map (MsgCheckString  xy 1) targetValue) |> on "blur"
                        , (Decode.succeed MsgSetVarNames) |> on "focus"
                        , list "Cond1"
                        ] []
                    , datalist
                        [id "Cond1"] (List.map viewDataList (Set.toList model.varNames))
                    , select
                        [ (Decode.map (MsgInputChanged xy 2) targetValue) |> on "change"
                        , style "position" "absolute"
                        , style "top" "65%"
                        , style "left" "40%"
                        , style "width" "40px"
                        ]
                        [ option [ value  "Eq", selected (cp == Eq) ] [ text "==" ]
                        , option [ value  "Ne", selected (cp == Ne) ] [ text "!=" ]
                        , option [ value  "Gt", selected (cp == Gt) ] [ text  ">" ]
                        , option [ value  "Lt", selected (cp == Lt) ] [ text  "<" ]
                        , option [ value  "Ge", selected (cp == Ge) ] [ text ">=" ]
                        , option [ value  "Le", selected (cp == Le) ] [ text "<=" ]
                        ]
                    , input
                        [ style "position" "absolute"
                        , style "top" "65%"
                        , style "left" "72%"
                        , style "width" "32px"
                        , value <| val2
                        , hidden False
                        , (Decode.map (MsgInputChanged xy 3) targetValue) |> on "input"
                        , (Decode.map (MsgCheckString  xy 3) targetValue) |> on "blur"
                        , (Decode.succeed MsgSetVarNames) |> on "focus"
                        , list "Cond3"
                        ] []
                    , datalist
                        [id "Cond3"] (List.map viewDataList (Set.toList model.varNames))
                    ]
            Push val ->
                div []
                    [
                      input
                        [ style "position" "absolute"
                        , style "top" "65%"
                        , style "left" "20%"
                        , style "width" "87px"
                        , value <| val
                        , hidden False
                        , (Decode.map (MsgInputChanged xy 1) targetValue) |> on "input"
                        , (Decode.map (MsgCheckString  xy 1) targetValue) |> on "blur"
                        , (Decode.succeed MsgSetVarNames) |> on "focus"
                        , list "Push"
                        ] []
                    , datalist
                        [id "Push"] (List.map viewDataList (Set.toList model.varNames))
                    ]
            Pop var ->
                div []
                    [
                      input
                        [ style "position" "absolute"
                        , style "top" "65%"
                        , style "left" "20%"
                        , style "width" "87px"
                        , value <| var
                        , hidden False
                        , (Decode.map (MsgInputChanged xy 1) targetValue) |> on "input"
                        ] []
                    ]
            _->  -- Name, Spaceは書き換えさせない
                div [][]
        ]

-- プレビュアーの表示
viewTurtle : Turtle -> Html Msg
viewTurtle turtle =
    let
        w =
            turtle.w

        body =
            [ x (String.fromFloat turtle.x)
            , y (String.fromFloat turtle.y)
            , width (String.fromFloat w)
            , height (String.fromFloat w)
            , stroke "black"
            , fill "lightgray"
            ]

        triangle =
            [ d
                ("M "
                    ++ String.fromFloat (turtle.x + w - w / 8)
                    ++ " "
                    ++ String.fromFloat (turtle.y + w / 2)
                    ++ " L "
                    ++ String.fromFloat (turtle.x + w / 2 + w / 8)
                    ++ " "
                    ++ String.fromFloat (turtle.y + w / 2 + w / 4)
                    ++ " L "
                    ++ String.fromFloat (turtle.x + w / 2 + w / 8)
                    ++ " "
                    ++ String.fromFloat (turtle.y + w / 2 - w / 4)
                    ++ " Z"
                )
            , stroke "black"
            , fill "gray"
            ]

        rotation =
            "rotate("
                ++ String.fromFloat turtle.heading
                ++ ", "
                ++ String.fromFloat (turtle.x + w / 2)
                ++ ", "
                ++ String.fromFloat (turtle.y + w / 2)
                ++ ")"

        lines =
            [ d (String.join " " turtle.lines)
            , stroke "red"
            ]
    in
    div
        []
        [ svg
            [ width "350", height "350", style "background-color" "white" ]
            [ g [] [path lines []]
            , g [ transform rotation ]
                [ rect body [], path triangle [] ]
            ]
        ]




-- エンコーダ


brickTypeEncode : BrickType -> Encode.Value
brickTypeEncode brickType =
    case brickType of
        BasicBrick ->
            Encode.string "BasicBrick"
        EntryBrick ->
            Encode.string "EntryBrick"
        CallBrick ->
            Encode.string "CallBrick"
        CaseBrick ->
            Encode.string "CaseBrick"
        SpacerBrick ->
            Encode.string "SpacerBrick"


brickCommandEncode : BrickCommand -> Encode.Value
brickCommandEncode brickCommand =
    case brickCommand of
        CommandNOP ->
            Encode.string "CommandNOP"
        CommandCalc ->
            Encode.string "CommandCalc"
        CommandPop ->
            Encode.string "CommandPop"
        CommandPush ->
            Encode.string "CommandPush"
        CommandPenDown ->
            Encode.string "CommandPenDown"
        CommandPenUp ->
            Encode.string "CommandPenUp"
        CommandInit ->
            Encode.string "CommandInit"
        CommandToioWait ->
            Encode.string "CommandToioWait"
        CommandToioMoveForward ->
            Encode.string "CommandToioMoveForward"
        CommandToioMoveBackward ->
            Encode.string "CommandToioMoveBackward"
        CommandToioTurnLeft ->
            Encode.string "CommandToioTurnLeft"
        CommandToioTurnRight ->
            Encode.string "CommandToioTurnRight"
        CommandToioStopMoving ->
            Encode.string "CommandToioStopMoving"
        CommandToioPlayPresetSound ->
            Encode.string "CommandToioPlayPresetSound"
        CommandToioStopPlaying ->
            Encode.string "CommandToioStopPlaying"
        CommandToioTurnOnLED_Red ->
            Encode.string "CommandToioTurnOnLED_Red"
        CommandToioTurnOnLED_Blue ->
            Encode.string "CommandToioTurnOnLED_Blue"
        CommandToioTurnOnLED_Green ->
            Encode.string "CommandToioTurnOnLED_Green"
        CommandToioTurnOffLED ->
            Encode.string "CommandToioTurnOffLED"

penStateToStr : PenState -> String
penStateToStr state =
    case state of
        Up   -> "Up"
        Down -> "Down"

textEncode : Text -> Encode.Value
textEncode text =
    let
        nameDecode str =
            Encode.object
                [ ("name", Encode.string str) ]
        paramDecode str =
            Encode.object
                [ ("parameter", Encode.string str) ]
        penDecode penState =
            Encode.object
                [ ("penState", Encode.string (penStateToStr penState)) ]
        pushDecode str =
            Encode.object
                [ ("value",   Encode.string str) ]
        popDecode str =
            Encode.object
                [ ("value",   Encode.string str) ]
        initDecode str1 str2 =
            Encode.object
                [ ("variable", Encode.string str1) -- 左辺の変数名
                , ("value",    Encode.string str2) -- 代入する値(右辺)
                ]
        calcDecode str1 str2 op str3 =
            Encode.object
                [ ("variable", Encode.string str1)            -- 左辺の変数名
                , ("value1",   Encode.string str2)            -- 1つ目の非演算子
                , ("operator", Encode.string (opToString op)) -- 算術演算子
                , ("value2",   Encode.string str3)            -- 2つ目の非演算子
                ]
        condDecode str1 cp str2 =
            Encode.object
                [ ("value1",     Encode.string str1)            -- 1つ目の非演算子
                , ("comparator", Encode.string (cpToString cp)) -- 比較演算子
                , ("value2",     Encode.string str2)            -- 2つ目の非演算子
                ]
        spaceDecode str =
            Encode.object
                [ ("direction", Encode.string str) ]
    in
        case text of
            Name str ->
                Encode.object
                    [ ("variant", Encode.string "Name")
                    , ("data",    nameDecode str)
                    ]
            Param str ->
                Encode.object
                    [ ("variant", Encode.string "Param")
                    , ("data",    paramDecode str)
                    ]
            Pen penState ->
                Encode.object
                    [ ("variant", Encode.string "Pen")
                    , ("data",    penDecode penState)
                    ]
            Push str ->
                Encode.object
                    [ ("variant", Encode.string "Push")
                    , ("data",    pushDecode str)
                    ]
            Pop str ->
                Encode.object
                    [ ("variant", Encode.string "Pop")
                    , ("data",    popDecode str)
                    ]
            Init str1 str2 ->
                Encode.object
                    [ ("variant", Encode.string "Init")
                    , ("data",    initDecode str1 str2)
                    ]
            Calc str1 str2 op str3 ->
                Encode.object
                    [ ("variant", Encode.string "Calc")
                    , ("data",    calcDecode str1 str2 op str3)
                    ]
            Cond str1 cp str2 ->
                Encode.object
                    [ ("variant", Encode.string "Cond")
                    , ("data",    condDecode str1 cp str2)
                    ]
            Space str ->
                Encode.object
                    [ ("variant", Encode.string "Space")
                    , ("data",    spaceDecode str)
                    ]

nodeEncode : Node -> Encode.Value
nodeEncode { getBrickType, getBrickCommand, getText } =
    Encode.object
        [ ("getBrickType", brickTypeEncode getBrickType)
        , ("getBrickCommand", brickCommandEncode getBrickCommand)
        , ("getText", textEncode getText)
        ]


astEncode : AST Node -> Encode.Value
astEncode ast =
    case ast of
        Nil ->
            Encode.null  -- JSON null値
        AST node left right ->
            Encode.object
                [ ("node", nodeEncode node)
                , ("left", astEncode left)
                , ("right", astEncode right)
                ]

astneEncode : ASTne Node -> Encode.Value
astneEncode (ASTne node left right) =
    Encode.object
        [ ("node", nodeEncode node)
        , ("left", astEncode left)
        , ("right", astEncode right)
        ]

positionEncode : (Magnitude, Magnitude) -> Encode.Value
positionEncode (x, y) =
    Encode.object
        [ ("x", Encode.float x)
        , ("y", Encode.float y)
        ]

astxyEncode : ASTxy Node -> Encode.Value
astxyEncode (ASTxy position astne) =
    Encode.object
        [ ("position", positionEncode position )
        , ("astne", astneEncode astne)
        ]

astRootsEncode : List (ASTxy Node) -> Encode.Value
astRootsEncode roots =
    Encode.list astxyEncode roots


-- デコーダ


loadProgram : String -> Model -> Model
loadProgram json model =
    case Decode.decodeString astRootsDecode json of
        Ok roots ->
            let names =
                    List.foldl
                        (\(ASTxy _ (ASTne node _ _)) ls ->
                            if node.getBrickType == EntryBrick then
                                case node.getText of
                                    Name name -> name :: ls
                                    _ -> ls
                            else ls
                        )
                        ["usagi", "kuma"]
                        roots
            in
            { model
                | getASTRoots = roots
                , routineNames = Set.fromList names
                , turtle = clearTurtle model.turtle
            }
        Err _ ->
            model

astRootsDecode : Decoder (List (ASTxy Node))
astRootsDecode =
    Decode.list astxyDecode

astxyDecode : Decoder (ASTxy Node)
astxyDecode =
    Decode.map2
        ASTxy
        (Decode.field "position" positionDecode)
        (Decode.field "astne" astneDecode)

positionDecode : Decoder Position
positionDecode =
    Decode.map2
        Tuple.pair
        (Decode.field "x" Decode.float)
        (Decode.field "y" Decode.float)

astneDecode : Decoder (ASTne Node)
astneDecode =
    Decode.map3
        ASTne
        (Decode.field "node"  nodeDecode)
        (Decode.field "left"  astDecode)
        (Decode.field "right" astDecode)

-- 再帰構造に対するDecoderの作成にはDecode.lazyが有効
-- 参考1 : https://qiita.com/ymtszw/items/a10229de887b38c7a65b
-- 参考2 : https://github.com/elm/compiler/blob/0.19.1/hints/bad-recursion.md#tricky-recursion
astDecode : Decoder (AST Node)
astDecode =
    Decode.oneOf
        [ Decode.null Nil
        , Decode.map3
            AST
            (Decode.field "node"  nodeDecode)
            (Decode.field "left"  (Decode.lazy (\() -> astDecode)))
            (Decode.field "right" (Decode.lazy (\() -> astDecode)))
        ]

nodeDecode : Decoder Node
nodeDecode =
    Decode.map3
        Node
        (Decode.field "getBrickType" brickTypeDecode)
        (Decode.field "getBrickCommand" brickCommandDecode)
        (Decode.field "getText" textDecode)

brickTypeDecode : Decoder BrickType
brickTypeDecode =
    Decode.string
        |> Decode.andThen
            ( \str ->
                case str of
                    "BasicBrick"  -> Decode.succeed BasicBrick
                    "EntryBrick"  -> Decode.succeed EntryBrick
                    "CallBrick"   -> Decode.succeed CallBrick
                    "CaseBrick"   -> Decode.succeed CaseBrick
                    "SpacerBrick" -> Decode.succeed SpacerBrick
                    _ -> Decode.fail "invalid brickType..."
            )

brickCommandDecode : Decoder BrickCommand
brickCommandDecode =
    Decode.string
        |> Decode.andThen
            ( \str ->
                case str of
                    "CommandNOP"                 -> Decode.succeed CommandNOP
                    "CommandCalc"                -> Decode.succeed CommandCalc
                    "CommandPop"                 -> Decode.succeed CommandPop
                    "CommandPush"                -> Decode.succeed CommandPush
                    "CommandPenDown"             -> Decode.succeed CommandPenDown
                    "CommandPenUp"               -> Decode.succeed CommandPenUp
                    "CommandInit"                -> Decode.succeed CommandInit
                    "CommandToioWait"            -> Decode.succeed CommandToioWait
                    "CommandToioMoveForward"     -> Decode.succeed CommandToioMoveForward
                    "CommandToioMoveBackward"    -> Decode.succeed CommandToioMoveBackward
                    "CommandToioTurnLeft"        -> Decode.succeed CommandToioTurnLeft
                    "CommandToioTurnRight"       -> Decode.succeed CommandToioTurnRight
                    "CommandToioStopMoving"      -> Decode.succeed CommandToioStopMoving
                    "CommandToioPlayPresetSound" -> Decode.succeed CommandToioPlayPresetSound
                    "CommandToioStopPlaying"     -> Decode.succeed CommandToioStopPlaying
                    "CommandToioTurnOnLED_Red"   -> Decode.succeed CommandToioTurnOnLED_Red
                    "CommandToioTurnOnLED_Blue"  -> Decode.succeed CommandToioTurnOnLED_Blue
                    "CommandToioTurnOnLED_Green" -> Decode.succeed CommandToioTurnOnLED_Green
                    "CommandToioTurnOffLED"      -> Decode.succeed CommandToioTurnOffLED
                    _ -> Decode.fail "invalid brickCommand..."
            )

penStateDecode : Decoder PenState
penStateDecode =
    Decode.string
        |> Decode.andThen
            (\str ->
                case str of
                    "Up" -> Decode.succeed Up
                    "Down" -> Decode.succeed Down
                    _ -> Decode.fail "invalid penState..."
            )

opDecode : Decoder Operator
opDecode =
    Decode.string
        |> Decode.andThen
            ( \str ->
                case str of
                    "Add"      -> Decode.succeed Add
                    "Sub"      -> Decode.succeed Sub
                    "Mul"      -> Decode.succeed Mul
                    "Div"      -> Decode.succeed Div
                    "Quotient" -> Decode.succeed Quotient
                    "Mod"      -> Decode.succeed Mod
                    _ -> Decode.fail "invalid operator..."
            )

cpDecode : Decoder Comparator
cpDecode =
    Decode.string
        |> Decode.andThen
            ( \str ->
                case str of
                    "Eq" -> Decode.succeed Eq
                    "Ne" -> Decode.succeed Ne
                    "Gt" -> Decode.succeed Gt
                    "Lt" -> Decode.succeed Lt
                    "Ge" -> Decode.succeed Ge
                    "Le" -> Decode.succeed Le
                    _ -> Decode.fail "invalid operator..."
            )

textDecode : Decoder Text
textDecode =
    Decode.field "variant" Decode.string
        |> Decode.andThen
            ( \str ->
                case str of
                    "Name"  ->
                        Decode.map
                            Name
                            (Decode.at ["data", "name"] Decode.string)
                    "Param" ->
                        Decode.map
                            Param
                            (Decode.at ["data", "parameter"] Decode.string)
                    "Pen"   ->
                        Decode.map
                            Pen
                            (Decode.at ["data", "penState"] penStateDecode)
                    "Push"  ->
                        Decode.map
                            Push
                            (Decode.at ["data", "value"] Decode.string)
                    "Pop"   ->
                        Decode.map
                            Pop
                            (Decode.at ["data", "value"] Decode.string)
                    "Init"  ->
                        Decode.map2
                            Init
                            (Decode.at ["data", "variable"] Decode.string)
                            (Decode.at ["data", "value"]    Decode.string)
                    "Calc"  ->
                        Decode.map4
                            Calc
                            (Decode.at ["data", "variable"] Decode.string)
                            (Decode.at ["data", "value1"]   Decode.string)
                            (Decode.at ["data", "operator"] opDecode)
                            (Decode.at ["data", "value2"]   Decode.string)
                    "Cond"  ->
                        Decode.map3
                            Cond
                            (Decode.at ["data", "value1"]     Decode.string)
                            (Decode.at ["data", "comparator"] cpDecode)
                            (Decode.at ["data", "value2"]     Decode.string)
                    "Space" ->
                        Decode.map
                            Space
                            (Decode.at ["data", "direction"] Decode.string)
                    _ ->
                        Decode.fail "invalid text..."
            )