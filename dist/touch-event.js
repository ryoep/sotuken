(function () {
    window.addEventListener("load", () => {
        const appNode = document.getElementById('elm-app');

        // Elmアプリを初期化
        const app = Elm.Main.init({
            node: appNode
        });

        // Elmアプリの参照を保存
        appNode.elmApp = app;

        // Touchstartリスナー: タッチポイント数を送信
        document.addEventListener("touchstart", (event) => {
            const touchCount = event.touches.length; // 同時にタッチしている指の数
            console.log(`Touchstart detected with ${touchCount} fingers.`);
            if (app.ports && app.ports.touchStart) {
                app.ports.touchStart.send(touchCount);
            }
        });

        // Touchendリスナー: タッチ終了イベント
        document.addEventListener("touchend", () => {
            console.log("Touchend detected.");
            if (app.ports && app.ports.touchEnd) {
                app.ports.touchEnd.send(null);
            }
        });
    });
})();
