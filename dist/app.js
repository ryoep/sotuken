(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File === 'function' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[94m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return word
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_dispatchEffects(managers, result.b, subscriptions(model));
	}

	_Platform_dispatchEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				p: bag.n,
				q: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.q)
		{
			x = temp.p(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		r: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		r: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



// DECODER

var _File_decoder = _Json_decodePrim(function(value) {
	// NOTE: checks if `File` exists in case this is run on node
	return (typeof File !== 'undefined' && value instanceof File)
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FILE', value);
});


// METADATA

function _File_name(file) { return file.name; }
function _File_mime(file) { return file.type; }
function _File_size(file) { return file.size; }

function _File_lastModified(file)
{
	return $elm$time$Time$millisToPosix(file.lastModified);
}


// DOWNLOAD

var _File_downloadNode;

function _File_getDownloadNode()
{
	return _File_downloadNode || (_File_downloadNode = document.createElement('a'));
}

var _File_download = F3(function(name, mime, content)
{
	return _Scheduler_binding(function(callback)
	{
		var blob = new Blob([content], {type: mime});

		// for IE10+
		if (navigator.msSaveOrOpenBlob)
		{
			navigator.msSaveOrOpenBlob(blob, name);
			return;
		}

		// for HTML5
		var node = _File_getDownloadNode();
		var objectUrl = URL.createObjectURL(blob);
		node.href = objectUrl;
		node.download = name;
		_File_click(node);
		URL.revokeObjectURL(objectUrl);
	});
});

function _File_downloadUrl(href)
{
	return _Scheduler_binding(function(callback)
	{
		var node = _File_getDownloadNode();
		node.href = href;
		node.download = '';
		node.origin === location.origin || (node.target = '_blank');
		_File_click(node);
	});
}


// IE COMPATIBILITY

function _File_makeBytesSafeForInternetExplorer(bytes)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/10
	// all other browsers can just run `new Blob([bytes])` directly with no problem
	//
	return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

function _File_click(node)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/11
	// all other browsers have MouseEvent and do not need this conditional stuff
	//
	if (typeof MouseEvent === 'function')
	{
		node.dispatchEvent(new MouseEvent('click'));
	}
	else
	{
		var event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		document.body.appendChild(node);
		node.dispatchEvent(event);
		document.body.removeChild(node);
	}
}


// UPLOAD

var _File_node;

function _File_uploadOne(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			callback(_Scheduler_succeed(event.target.files[0]));
		});
		_File_click(_File_node);
	});
}

function _File_uploadOneOrMore(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.multiple = true;
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			var elmFiles = _List_fromArray(event.target.files);
			callback(_Scheduler_succeed(_Utils_Tuple2(elmFiles.a, elmFiles.b)));
		});
		_File_click(_File_node);
	});
}


// CONTENT

function _File_toString(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsText(blob);
		return function() { reader.abort(); };
	});
}

function _File_toBytes(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(new DataView(reader.result)));
		});
		reader.readAsArrayBuffer(blob);
		return function() { reader.abort(); };
	});
}

function _File_toUrl(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsDataURL(blob);
		return function() { reader.abort(); };
	});
}

var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Main$Done = {$: 'Done'};
var $author$project$Main$Nil = {$: 'Nil'};
var $author$project$Main$Up = {$: 'Up'};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var $elm$core$Set$empty = $elm$core$Set$Set_elm_builtin($elm$core$Dict$empty);
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A3($elm$core$Dict$insert, key, _Utils_Tuple0, dict));
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2(
		{
			getASTRoots: _List_Nil,
			getBrickSize: 128,
			getDnDInfo: {
				getMouseXY: _Utils_Tuple2(0, 0),
				getOnDnD: false,
				getRootXY: _Utils_Tuple2(0, 0)
			},
			initHeadingBox: '270',
			initXBox: '150',
			initYBox: '150',
			routineBox: '',
			routineNames: $elm$core$Set$fromList(
				_List_fromArray(
					['usagi', 'kuma'])),
			turtle: {avelocity: 0, callStack: _List_Nil, current: $author$project$Main$Nil, forward_remaining: 0, heading: 270, initHeading: 270, initX: 150, initY: 150, lines: _List_Nil, penState: $author$project$Main$Up, stack: _List_Nil, state: $author$project$Main$Done, turn_remaining: 0, variables: $elm$core$Dict$empty, velocity: 0, w: 32, wait_remaining: 0, x: 150, y: 150},
			varNames: $elm$core$Set$empty
		},
		$elm$core$Platform$Cmd$none);
};
var $author$project$Main$MsgTick = function (a) {
	return {$: 'MsgTick', a: a};
};
var $author$project$Main$Running = {$: 'Running'};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$browser$Browser$AnimationManager$Delta = function (a) {
	return {$: 'Delta', a: a};
};
var $elm$browser$Browser$AnimationManager$State = F3(
	function (subs, request, oldTime) {
		return {oldTime: oldTime, request: request, subs: subs};
	});
var $elm$browser$Browser$AnimationManager$init = $elm$core$Task$succeed(
	A3($elm$browser$Browser$AnimationManager$State, _List_Nil, $elm$core$Maybe$Nothing, 0));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$browser$Browser$AnimationManager$now = _Browser_now(_Utils_Tuple0);
var $elm$browser$Browser$AnimationManager$rAF = _Browser_rAF(_Utils_Tuple0);
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$browser$Browser$AnimationManager$onEffects = F3(
	function (router, subs, _v0) {
		var request = _v0.request;
		var oldTime = _v0.oldTime;
		var _v1 = _Utils_Tuple2(request, subs);
		if (_v1.a.$ === 'Nothing') {
			if (!_v1.b.b) {
				var _v2 = _v1.a;
				return $elm$browser$Browser$AnimationManager$init;
			} else {
				var _v4 = _v1.a;
				return A2(
					$elm$core$Task$andThen,
					function (pid) {
						return A2(
							$elm$core$Task$andThen,
							function (time) {
								return $elm$core$Task$succeed(
									A3(
										$elm$browser$Browser$AnimationManager$State,
										subs,
										$elm$core$Maybe$Just(pid),
										time));
							},
							$elm$browser$Browser$AnimationManager$now);
					},
					$elm$core$Process$spawn(
						A2(
							$elm$core$Task$andThen,
							$elm$core$Platform$sendToSelf(router),
							$elm$browser$Browser$AnimationManager$rAF)));
			}
		} else {
			if (!_v1.b.b) {
				var pid = _v1.a.a;
				return A2(
					$elm$core$Task$andThen,
					function (_v3) {
						return $elm$browser$Browser$AnimationManager$init;
					},
					$elm$core$Process$kill(pid));
			} else {
				return $elm$core$Task$succeed(
					A3($elm$browser$Browser$AnimationManager$State, subs, request, oldTime));
			}
		}
	});
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$browser$Browser$AnimationManager$onSelfMsg = F3(
	function (router, newTime, _v0) {
		var subs = _v0.subs;
		var oldTime = _v0.oldTime;
		var send = function (sub) {
			if (sub.$ === 'Time') {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(
						$elm$time$Time$millisToPosix(newTime)));
			} else {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(newTime - oldTime));
			}
		};
		return A2(
			$elm$core$Task$andThen,
			function (pid) {
				return A2(
					$elm$core$Task$andThen,
					function (_v1) {
						return $elm$core$Task$succeed(
							A3(
								$elm$browser$Browser$AnimationManager$State,
								subs,
								$elm$core$Maybe$Just(pid),
								newTime));
					},
					$elm$core$Task$sequence(
						A2($elm$core$List$map, send, subs)));
			},
			$elm$core$Process$spawn(
				A2(
					$elm$core$Task$andThen,
					$elm$core$Platform$sendToSelf(router),
					$elm$browser$Browser$AnimationManager$rAF)));
	});
var $elm$browser$Browser$AnimationManager$Time = function (a) {
	return {$: 'Time', a: a};
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$browser$Browser$AnimationManager$subMap = F2(
	function (func, sub) {
		if (sub.$ === 'Time') {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Time(
				A2($elm$core$Basics$composeL, func, tagger));
		} else {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Delta(
				A2($elm$core$Basics$composeL, func, tagger));
		}
	});
_Platform_effectManagers['Browser.AnimationManager'] = _Platform_createManager($elm$browser$Browser$AnimationManager$init, $elm$browser$Browser$AnimationManager$onEffects, $elm$browser$Browser$AnimationManager$onSelfMsg, 0, $elm$browser$Browser$AnimationManager$subMap);
var $elm$browser$Browser$AnimationManager$subscription = _Platform_leaf('Browser.AnimationManager');
var $elm$browser$Browser$AnimationManager$onAnimationFrameDelta = function (tagger) {
	return $elm$browser$Browser$AnimationManager$subscription(
		$elm$browser$Browser$AnimationManager$Delta(tagger));
};
var $elm$browser$Browser$Events$onAnimationFrameDelta = $elm$browser$Browser$AnimationManager$onAnimationFrameDelta;
var $author$project$Main$subscriptions = function (model) {
	return _Utils_eq(model.turtle.state, $author$project$Main$Running) ? $elm$browser$Browser$Events$onAnimationFrameDelta($author$project$Main$MsgTick) : $elm$core$Platform$Sub$none;
};
var $author$project$Main$ASTxy = F2(
	function (a, b) {
		return {$: 'ASTxy', a: a, b: b};
	});
var $author$project$Main$MsgLoaded = function (a) {
	return {$: 'MsgLoaded', a: a};
};
var $author$project$Main$MsgSelected = function (a) {
	return {$: 'MsgSelected', a: a};
};
var $author$project$Main$Start = {$: 'Start'};
var $author$project$Main$ASTne = F3(
	function (a, b, c) {
		return {$: 'ASTne', a: a, b: b, c: c};
	});
var $author$project$Main$CaseBrick = {$: 'CaseBrick'};
var $author$project$Main$Changed = function (a) {
	return {$: 'Changed', a: a};
};
var $author$project$Main$EntryBrick = {$: 'EntryBrick'};
var $author$project$Main$Space = function (a) {
	return {$: 'Space', a: a};
};
var $author$project$Main$Unchanged = function (a) {
	return {$: 'Unchanged', a: a};
};
var $author$project$Main$AST = F3(
	function (a, b, c) {
		return {$: 'AST', a: a, b: b, c: c};
	});
var $author$project$Main$asAST = function (_v0) {
	var n = _v0.a;
	var b = _v0.b;
	var r = _v0.c;
	return A3($author$project$Main$AST, n, b, r);
};
var $author$project$Main$mapC = F2(
	function (f, cx) {
		if (cx.$ === 'Changed') {
			var x = cx.a;
			return $author$project$Main$Changed(
				f(x));
		} else {
			var x = cx.a;
			return $author$project$Main$Unchanged(
				f(x));
		}
	});
var $author$project$Main$changeOnce = F2(
	function (f, xs_) {
		if (!xs_.b) {
			return $author$project$Main$Unchanged(_List_Nil);
		} else {
			var x = xs_.a;
			var xs = xs_.b;
			var _v1 = f(x);
			if (_v1.$ === 'Changed') {
				var a = _v1.a;
				return $author$project$Main$Changed(
					A2($elm$core$List$cons, a, xs));
			} else {
				return A2(
					$author$project$Main$mapC,
					function (ys) {
						return A2($elm$core$List$cons, x, ys);
					},
					A2($author$project$Main$changeOnce, f, xs));
			}
		}
	});
var $author$project$Main$mapC2 = F3(
	function (f, cx, cy) {
		var _v0 = _Utils_Tuple2(cx, cy);
		if (_v0.a.$ === 'Changed') {
			if (_v0.b.$ === 'Changed') {
				var x = _v0.a.a;
				var y = _v0.b.a;
				return $author$project$Main$Changed(
					A2(f, x, y));
			} else {
				var x = _v0.a.a;
				var y = _v0.b.a;
				return $author$project$Main$Changed(
					A2(f, x, y));
			}
		} else {
			if (_v0.b.$ === 'Changed') {
				var x = _v0.a.a;
				var y = _v0.b.a;
				return $author$project$Main$Changed(
					A2(f, x, y));
			} else {
				var x = _v0.a.a;
				var y = _v0.b.a;
				return $author$project$Main$Unchanged(
					A2(f, x, y));
			}
		}
	});
var $author$project$Main$fanOut = F5(
	function (d, funB, funR, _v0, _v1) {
		var x = _v0.a;
		var y = _v0.b;
		var n = _v1.a;
		var b = _v1.b;
		var r = _v1.c;
		var _v2 = A2(
			funB,
			_Utils_Tuple2(x, y + d),
			b);
		if (_v2.$ === 'Changed') {
			var newB = _v2.a;
			return A3(
				$author$project$Main$mapC2,
				$author$project$Main$ASTne(n),
				$author$project$Main$Changed(newB),
				$author$project$Main$Unchanged(r));
		} else {
			return A3(
				$author$project$Main$mapC2,
				$author$project$Main$ASTne(n),
				$author$project$Main$Unchanged(b),
				A2(
					funR,
					_Utils_Tuple2(x + d, y),
					r));
		}
	});
var $author$project$Main$mergin = 20;
var $author$project$Main$insideBrick = F2(
	function (_v0, _v1) {
		var x0 = _v0.a;
		var y0 = _v0.b;
		var x = _v1.a;
		var y = _v1.b;
		return (_Utils_cmp(y0 - $author$project$Main$mergin, y) < 1) && ((_Utils_cmp(y, y0 + $author$project$Main$mergin) < 1) && ((_Utils_cmp(x0 - $author$project$Main$mergin, x) < 1) && (_Utils_cmp(x, x0 + $author$project$Main$mergin) < 1)));
	});
var $author$project$Main$interval = function (model) {
	return model.getBrickSize * 0.9;
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Main$removeASTxy = F2(
	function (astxy, model) {
		return _Utils_update(
			model,
			{
				getASTRoots: A2(
					$elm$core$List$filter,
					function (a) {
						return !_Utils_eq(a, astxy);
					},
					model.getASTRoots)
			});
	});
var $author$project$Main$attachMe = F2(
	function (oldRoot, model) {
		var rootXY = oldRoot.a;
		var astne = oldRoot.b;
		var node = astne.a;
		if (_Utils_eq(node.getBrickType, $author$project$Main$EntryBrick)) {
			return model;
		} else {
			var isAttachableR = F3(
				function (n, b, r) {
					return (_Utils_eq(
						n.getText,
						$author$project$Main$Space('down')) || _Utils_eq(
						r.getText,
						$author$project$Main$Space('down'))) ? false : (_Utils_eq(n.getBrickType, $author$project$Main$CaseBrick) || _Utils_eq(b, $author$project$Main$Nil));
				});
			var isAttachableB = F3(
				function (n, r, b) {
					return (_Utils_eq(
						n.getText,
						$author$project$Main$Space('right')) || _Utils_eq(
						b.getText,
						$author$project$Main$Space('right'))) ? false : (_Utils_eq(n.getBrickType, $author$project$Main$CaseBrick) || _Utils_eq(r, $author$project$Main$Nil));
				});
			var traverse = F3(
				function (attachable, xy, ast) {
					if (ast.$ === 'Nil') {
						return (attachable && A2($author$project$Main$insideBrick, xy, rootXY)) ? $author$project$Main$Changed(
							$author$project$Main$asAST(astne)) : $author$project$Main$Unchanged($author$project$Main$Nil);
					} else {
						var n = ast.a;
						var b = ast.b;
						var r = ast.c;
						return A2(
							$author$project$Main$mapC,
							$author$project$Main$asAST,
							A5(
								$author$project$Main$fanOut,
								$author$project$Main$interval(model),
								traverse(
									A3(isAttachableB, n, r, node)),
								traverse(
									A3(isAttachableR, n, b, node)),
								xy,
								A3($author$project$Main$ASTne, n, b, r)));
					}
				});
			var newRoots = A2(
				$author$project$Main$changeOnce,
				function (_v2) {
					var xy = _v2.a;
					var ast = _v2.b;
					var n = ast.a;
					var b = ast.b;
					var r = ast.c;
					return A2(
						$author$project$Main$mapC,
						$author$project$Main$ASTxy(xy),
						A5(
							$author$project$Main$fanOut,
							$author$project$Main$interval(model),
							traverse(
								A3(isAttachableB, n, r, node)),
							traverse(
								A3(isAttachableR, n, b, node)),
							xy,
							ast));
				},
				model.getASTRoots);
			if (newRoots.$ === 'Changed') {
				var roots = newRoots.a;
				return A2(
					$author$project$Main$removeASTxy,
					oldRoot,
					_Utils_update(
						model,
						{getASTRoots: roots}));
			} else {
				return model;
			}
		}
	});
var $author$project$Main$clearTurtle = function (turtle) {
	return _Utils_update(
		turtle,
		{avelocity: 0.2, callStack: _List_Nil, current: $author$project$Main$Nil, forward_remaining: 0, heading: turtle.initHeading, lines: _List_Nil, penState: $author$project$Main$Up, stack: _List_Nil, state: $author$project$Main$Done, turn_remaining: 0, variables: $elm$core$Dict$empty, velocity: 0.1, wait_remaining: 0, x: turtle.initX, y: turtle.initY});
};
var $elm$core$String$toFloat = _String_toFloat;
var $author$project$Main$checkInitHeading = function (model) {
	if (!_Utils_eq(model.turtle.state, $author$project$Main$Done)) {
		return model;
	} else {
		var newHeadingBox = $elm$core$String$isEmpty(model.initHeadingBox) ? '270' : model.initHeadingBox;
		var newHeading = function () {
			var _v0 = $elm$core$String$toFloat(newHeadingBox);
			if (_v0.$ === 'Just') {
				var num = _v0.a;
				return num;
			} else {
				return model.turtle.heading;
			}
		}();
		var modifyTurtle = function (turtle) {
			return _Utils_update(
				turtle,
				{initHeading: newHeading});
		};
		return _Utils_update(
			model,
			{
				initHeadingBox: newHeadingBox,
				turtle: $author$project$Main$clearTurtle(
					modifyTurtle(model.turtle))
			});
	}
};
var $author$project$Main$checkInitX = function (model) {
	if (!_Utils_eq(model.turtle.state, $author$project$Main$Done)) {
		return model;
	} else {
		var newXBox = $elm$core$String$isEmpty(model.initXBox) ? '150' : model.initXBox;
		var newX = function () {
			var _v0 = $elm$core$String$toFloat(newXBox);
			if (_v0.$ === 'Just') {
				var num = _v0.a;
				return num;
			} else {
				return model.turtle.x;
			}
		}();
		var modifyTurtle = function (turtle) {
			return _Utils_update(
				turtle,
				{initX: newX});
		};
		return _Utils_update(
			model,
			{
				initXBox: newXBox,
				turtle: $author$project$Main$clearTurtle(
					modifyTurtle(model.turtle))
			});
	}
};
var $author$project$Main$checkInitY = function (model) {
	if (!_Utils_eq(model.turtle.state, $author$project$Main$Done)) {
		return model;
	} else {
		var newYBox = $elm$core$String$isEmpty(model.initYBox) ? '150' : model.initYBox;
		var newY = function () {
			var _v0 = $elm$core$String$toFloat(newYBox);
			if (_v0.$ === 'Just') {
				var num = _v0.a;
				return num;
			} else {
				return model.turtle.y;
			}
		}();
		var modifyTurtle = function (turtle) {
			return _Utils_update(
				turtle,
				{initY: newY});
		};
		return _Utils_update(
			model,
			{
				initYBox: newYBox,
				turtle: $author$project$Main$clearTurtle(
					modifyTurtle(model.turtle))
			});
	}
};
var $author$project$Main$addASTxy = F2(
	function (astxy, model) {
		return _Utils_update(
			model,
			{
				getASTRoots: _Utils_ap(
					model.getASTRoots,
					_List_fromArray(
						[astxy]))
			});
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$Basics$not = _Basics_not;
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $author$project$Main$cloneUs = F2(
	function (_v0, model) {
		var _v1 = _v0.a;
		var x = _v1.a;
		var y = _v1.b;
		var _v2 = _v0.b;
		var newNode = _v2.a;
		var left = _v2.b;
		var right = _v2.c;
		var isClonable = (!_Utils_eq(newNode.getBrickType, $author$project$Main$EntryBrick)) || A2(
			$elm$core$List$all,
			function (_v3) {
				var _v4 = _v3.b;
				var node = _v4.a;
				return !_Utils_eq(node, newNode);
			},
			model.getASTRoots);
		return isClonable ? A2(
			$author$project$Main$addASTxy,
			A2(
				$author$project$Main$ASTxy,
				_Utils_Tuple2(x + 10, y + 10),
				A3($author$project$Main$ASTne, newNode, left, right)),
			model) : model;
	});
var $author$project$Main$Cond = F3(
	function (a, b, c) {
		return {$: 'Cond', a: a, b: b, c: c};
	});
var $author$project$Main$Init = F2(
	function (a, b) {
		return {$: 'Init', a: a, b: b};
	});
var $author$project$Main$Push = function (a) {
	return {$: 'Push', a: a};
};
var $elm$core$String$endsWith = _String_endsWith;
var $author$project$Main$completeDblquote = F3(
	function (text, place, _new) {
		var dblquote = function (str) {
			return (!A2($elm$core$String$startsWith, '\"', str)) ? str : ((str === '\"') ? '\"\"' : ((!A2($elm$core$String$endsWith, '\"', str)) ? (str + '\"') : str));
		};
		switch (text.$) {
			case 'Init':
				var _var = text.a;
				var val = text.b;
				if (place === 2) {
					return A2(
						$author$project$Main$Init,
						_var,
						dblquote(_new));
				} else {
					return text;
				}
			case 'Cond':
				var val1 = text.a;
				var cp = text.b;
				var val2 = text.c;
				switch (place) {
					case 1:
						return A3(
							$author$project$Main$Cond,
							dblquote(_new),
							cp,
							val2);
					case 3:
						return A3(
							$author$project$Main$Cond,
							val1,
							cp,
							dblquote(_new));
					default:
						return text;
				}
			case 'Push':
				var val = text.a;
				if (place === 1) {
					return $author$project$Main$Push(
						dblquote(_new));
				} else {
					return text;
				}
			default:
				return text;
		}
	});
var $elm$file$File$Select$file = F2(
	function (mimes, toMsg) {
		return A2(
			$elm$core$Task$perform,
			toMsg,
			_File_uploadOne(mimes));
	});
var $author$project$Main$getASTVars = function (ast) {
	if (ast.$ === 'Nil') {
		return _List_Nil;
	} else {
		var node = ast.a;
		var left = ast.b;
		var right = ast.c;
		var varName = function () {
			var _v1 = node.getText;
			switch (_v1.$) {
				case 'Init':
					var _var = _v1.a;
					return _List_fromArray(
						[_var]);
				case 'Calc':
					var _var = _v1.a;
					return _List_fromArray(
						[_var]);
				case 'Pop':
					var _var = _v1.a;
					return _List_fromArray(
						[_var]);
				default:
					return _List_Nil;
			}
		}();
		var rightVarNames = $author$project$Main$getASTVars(right);
		var leftVarNames = $author$project$Main$getASTVars(left);
		return _Utils_ap(
			varName,
			_Utils_ap(leftVarNames, rightVarNames));
	}
};
var $author$project$Main$getVarNames = function (model) {
	var varList = A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, list) {
				var astne = _v0.b;
				return _Utils_ap(
					list,
					$author$project$Main$getASTVars(
						$author$project$Main$asAST(astne)));
			}),
		_List_Nil,
		model.getASTRoots);
	return _Utils_update(
		model,
		{
			varNames: $elm$core$Set$fromList(varList)
		});
};
var $author$project$Main$letMeRoot = F2(
	function (newRoot, model) {
		var newRootXY = newRoot.a;
		var traverse = F2(
			function (xy, ast) {
				if (ast.$ === 'Nil') {
					return $author$project$Main$Unchanged($author$project$Main$Nil);
				} else {
					var n = ast.a;
					var b = ast.b;
					var r = ast.c;
					return A2($author$project$Main$insideBrick, xy, newRootXY) ? $author$project$Main$Changed($author$project$Main$Nil) : A2(
						$author$project$Main$mapC,
						$author$project$Main$asAST,
						A5(
							$author$project$Main$fanOut,
							$author$project$Main$interval(model),
							traverse,
							traverse,
							xy,
							A3($author$project$Main$ASTne, n, b, r)));
				}
			});
		var newRoots = A2(
			$author$project$Main$changeOnce,
			function (_v2) {
				var xy = _v2.a;
				var astne = _v2.b;
				return A2(
					$author$project$Main$mapC,
					$author$project$Main$ASTxy(xy),
					A5(
						$author$project$Main$fanOut,
						$author$project$Main$interval(model),
						traverse,
						traverse,
						xy,
						astne));
			},
			model.getASTRoots);
		if (newRoots.$ === 'Changed') {
			var roots = newRoots.a;
			return A2(
				$author$project$Main$addASTxy,
				newRoot,
				_Utils_update(
					model,
					{getASTRoots: roots}));
		} else {
			return model;
		}
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$lazy = function (thunk) {
	return A2(
		$elm$json$Json$Decode$andThen,
		thunk,
		$elm$json$Json$Decode$succeed(_Utils_Tuple0));
};
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Main$Node = F3(
	function (getBrickType, getBrickCommand, getText) {
		return {getBrickCommand: getBrickCommand, getBrickType: getBrickType, getText: getText};
	});
var $author$project$Main$CommandCalc = {$: 'CommandCalc'};
var $author$project$Main$CommandInit = {$: 'CommandInit'};
var $author$project$Main$CommandNOP = {$: 'CommandNOP'};
var $author$project$Main$CommandPenDown = {$: 'CommandPenDown'};
var $author$project$Main$CommandPenUp = {$: 'CommandPenUp'};
var $author$project$Main$CommandPop = {$: 'CommandPop'};
var $author$project$Main$CommandPush = {$: 'CommandPush'};
var $author$project$Main$CommandToioMoveBackward = {$: 'CommandToioMoveBackward'};
var $author$project$Main$CommandToioMoveForward = {$: 'CommandToioMoveForward'};
var $author$project$Main$CommandToioPlayPresetSound = {$: 'CommandToioPlayPresetSound'};
var $author$project$Main$CommandToioStopMoving = {$: 'CommandToioStopMoving'};
var $author$project$Main$CommandToioStopPlaying = {$: 'CommandToioStopPlaying'};
var $author$project$Main$CommandToioTurnLeft = {$: 'CommandToioTurnLeft'};
var $author$project$Main$CommandToioTurnOffLED = {$: 'CommandToioTurnOffLED'};
var $author$project$Main$CommandToioTurnOnLED_Blue = {$: 'CommandToioTurnOnLED_Blue'};
var $author$project$Main$CommandToioTurnOnLED_Green = {$: 'CommandToioTurnOnLED_Green'};
var $author$project$Main$CommandToioTurnOnLED_Red = {$: 'CommandToioTurnOnLED_Red'};
var $author$project$Main$CommandToioTurnRight = {$: 'CommandToioTurnRight'};
var $author$project$Main$CommandToioWait = {$: 'CommandToioWait'};
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Main$brickCommandDecode = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'CommandNOP':
				return $elm$json$Json$Decode$succeed($author$project$Main$CommandNOP);
			case 'CommandCalc':
				return $elm$json$Json$Decode$succeed($author$project$Main$CommandCalc);
			case 'CommandPop':
				return $elm$json$Json$Decode$succeed($author$project$Main$CommandPop);
			case 'CommandPush':
				return $elm$json$Json$Decode$succeed($author$project$Main$CommandPush);
			case 'CommandPenDown':
				return $elm$json$Json$Decode$succeed($author$project$Main$CommandPenDown);
			case 'CommandPenUp':
				return $elm$json$Json$Decode$succeed($author$project$Main$CommandPenUp);
			case 'CommandInit':
				return $elm$json$Json$Decode$succeed($author$project$Main$CommandInit);
			case 'CommandToioWait':
				return $elm$json$Json$Decode$succeed($author$project$Main$CommandToioWait);
			case 'CommandToioMoveForward':
				return $elm$json$Json$Decode$succeed($author$project$Main$CommandToioMoveForward);
			case 'CommandToioMoveBackward':
				return $elm$json$Json$Decode$succeed($author$project$Main$CommandToioMoveBackward);
			case 'CommandToioTurnLeft':
				return $elm$json$Json$Decode$succeed($author$project$Main$CommandToioTurnLeft);
			case 'CommandToioTurnRight':
				return $elm$json$Json$Decode$succeed($author$project$Main$CommandToioTurnRight);
			case 'CommandToioStopMoving':
				return $elm$json$Json$Decode$succeed($author$project$Main$CommandToioStopMoving);
			case 'CommandToioPlayPresetSound':
				return $elm$json$Json$Decode$succeed($author$project$Main$CommandToioPlayPresetSound);
			case 'CommandToioStopPlaying':
				return $elm$json$Json$Decode$succeed($author$project$Main$CommandToioStopPlaying);
			case 'CommandToioTurnOnLED_Red':
				return $elm$json$Json$Decode$succeed($author$project$Main$CommandToioTurnOnLED_Red);
			case 'CommandToioTurnOnLED_Blue':
				return $elm$json$Json$Decode$succeed($author$project$Main$CommandToioTurnOnLED_Blue);
			case 'CommandToioTurnOnLED_Green':
				return $elm$json$Json$Decode$succeed($author$project$Main$CommandToioTurnOnLED_Green);
			case 'CommandToioTurnOffLED':
				return $elm$json$Json$Decode$succeed($author$project$Main$CommandToioTurnOffLED);
			default:
				return $elm$json$Json$Decode$fail('invalid brickCommand...');
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Main$BasicBrick = {$: 'BasicBrick'};
var $author$project$Main$CallBrick = {$: 'CallBrick'};
var $author$project$Main$SpacerBrick = {$: 'SpacerBrick'};
var $author$project$Main$brickTypeDecode = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'BasicBrick':
				return $elm$json$Json$Decode$succeed($author$project$Main$BasicBrick);
			case 'EntryBrick':
				return $elm$json$Json$Decode$succeed($author$project$Main$EntryBrick);
			case 'CallBrick':
				return $elm$json$Json$Decode$succeed($author$project$Main$CallBrick);
			case 'CaseBrick':
				return $elm$json$Json$Decode$succeed($author$project$Main$CaseBrick);
			case 'SpacerBrick':
				return $elm$json$Json$Decode$succeed($author$project$Main$SpacerBrick);
			default:
				return $elm$json$Json$Decode$fail('invalid brickType...');
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Main$Calc = F4(
	function (a, b, c, d) {
		return {$: 'Calc', a: a, b: b, c: c, d: d};
	});
var $author$project$Main$Name = function (a) {
	return {$: 'Name', a: a};
};
var $author$project$Main$Param = function (a) {
	return {$: 'Param', a: a};
};
var $author$project$Main$Pen = function (a) {
	return {$: 'Pen', a: a};
};
var $author$project$Main$Pop = function (a) {
	return {$: 'Pop', a: a};
};
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $author$project$Main$Eq = {$: 'Eq'};
var $author$project$Main$Ge = {$: 'Ge'};
var $author$project$Main$Gt = {$: 'Gt'};
var $author$project$Main$Le = {$: 'Le'};
var $author$project$Main$Lt = {$: 'Lt'};
var $author$project$Main$Ne = {$: 'Ne'};
var $author$project$Main$cpDecode = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'Eq':
				return $elm$json$Json$Decode$succeed($author$project$Main$Eq);
			case 'Ne':
				return $elm$json$Json$Decode$succeed($author$project$Main$Ne);
			case 'Gt':
				return $elm$json$Json$Decode$succeed($author$project$Main$Gt);
			case 'Lt':
				return $elm$json$Json$Decode$succeed($author$project$Main$Lt);
			case 'Ge':
				return $elm$json$Json$Decode$succeed($author$project$Main$Ge);
			case 'Le':
				return $elm$json$Json$Decode$succeed($author$project$Main$Le);
			default:
				return $elm$json$Json$Decode$fail('invalid operator...');
		}
	},
	$elm$json$Json$Decode$string);
var $elm$json$Json$Decode$map4 = _Json_map4;
var $author$project$Main$Add = {$: 'Add'};
var $author$project$Main$Div = {$: 'Div'};
var $author$project$Main$Mod = {$: 'Mod'};
var $author$project$Main$Mul = {$: 'Mul'};
var $author$project$Main$Quotient = {$: 'Quotient'};
var $author$project$Main$Sub = {$: 'Sub'};
var $author$project$Main$opDecode = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'Add':
				return $elm$json$Json$Decode$succeed($author$project$Main$Add);
			case 'Sub':
				return $elm$json$Json$Decode$succeed($author$project$Main$Sub);
			case 'Mul':
				return $elm$json$Json$Decode$succeed($author$project$Main$Mul);
			case 'Div':
				return $elm$json$Json$Decode$succeed($author$project$Main$Div);
			case 'Quotient':
				return $elm$json$Json$Decode$succeed($author$project$Main$Quotient);
			case 'Mod':
				return $elm$json$Json$Decode$succeed($author$project$Main$Mod);
			default:
				return $elm$json$Json$Decode$fail('invalid operator...');
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Main$Down = {$: 'Down'};
var $author$project$Main$penStateDecode = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'Up':
				return $elm$json$Json$Decode$succeed($author$project$Main$Up);
			case 'Down':
				return $elm$json$Json$Decode$succeed($author$project$Main$Down);
			default:
				return $elm$json$Json$Decode$fail('invalid penState...');
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Main$textDecode = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'Name':
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$Main$Name,
					A2(
						$elm$json$Json$Decode$at,
						_List_fromArray(
							['data', 'name']),
						$elm$json$Json$Decode$string));
			case 'Param':
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$Main$Param,
					A2(
						$elm$json$Json$Decode$at,
						_List_fromArray(
							['data', 'parameter']),
						$elm$json$Json$Decode$string));
			case 'Pen':
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$Main$Pen,
					A2(
						$elm$json$Json$Decode$at,
						_List_fromArray(
							['data', 'penState']),
						$author$project$Main$penStateDecode));
			case 'Push':
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$Main$Push,
					A2(
						$elm$json$Json$Decode$at,
						_List_fromArray(
							['data', 'value']),
						$elm$json$Json$Decode$string));
			case 'Pop':
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$Main$Pop,
					A2(
						$elm$json$Json$Decode$at,
						_List_fromArray(
							['data', 'value']),
						$elm$json$Json$Decode$string));
			case 'Init':
				return A3(
					$elm$json$Json$Decode$map2,
					$author$project$Main$Init,
					A2(
						$elm$json$Json$Decode$at,
						_List_fromArray(
							['data', 'variable']),
						$elm$json$Json$Decode$string),
					A2(
						$elm$json$Json$Decode$at,
						_List_fromArray(
							['data', 'value']),
						$elm$json$Json$Decode$string));
			case 'Calc':
				return A5(
					$elm$json$Json$Decode$map4,
					$author$project$Main$Calc,
					A2(
						$elm$json$Json$Decode$at,
						_List_fromArray(
							['data', 'variable']),
						$elm$json$Json$Decode$string),
					A2(
						$elm$json$Json$Decode$at,
						_List_fromArray(
							['data', 'value1']),
						$elm$json$Json$Decode$string),
					A2(
						$elm$json$Json$Decode$at,
						_List_fromArray(
							['data', 'operator']),
						$author$project$Main$opDecode),
					A2(
						$elm$json$Json$Decode$at,
						_List_fromArray(
							['data', 'value2']),
						$elm$json$Json$Decode$string));
			case 'Cond':
				return A4(
					$elm$json$Json$Decode$map3,
					$author$project$Main$Cond,
					A2(
						$elm$json$Json$Decode$at,
						_List_fromArray(
							['data', 'value1']),
						$elm$json$Json$Decode$string),
					A2(
						$elm$json$Json$Decode$at,
						_List_fromArray(
							['data', 'comparator']),
						$author$project$Main$cpDecode),
					A2(
						$elm$json$Json$Decode$at,
						_List_fromArray(
							['data', 'value2']),
						$elm$json$Json$Decode$string));
			case 'Space':
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$Main$Space,
					A2(
						$elm$json$Json$Decode$at,
						_List_fromArray(
							['data', 'direction']),
						$elm$json$Json$Decode$string));
			default:
				return $elm$json$Json$Decode$fail('invalid text...');
		}
	},
	A2($elm$json$Json$Decode$field, 'variant', $elm$json$Json$Decode$string));
var $author$project$Main$nodeDecode = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Main$Node,
	A2($elm$json$Json$Decode$field, 'getBrickType', $author$project$Main$brickTypeDecode),
	A2($elm$json$Json$Decode$field, 'getBrickCommand', $author$project$Main$brickCommandDecode),
	A2($elm$json$Json$Decode$field, 'getText', $author$project$Main$textDecode));
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
function $author$project$Main$cyclic$astDecode() {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$elm$json$Json$Decode$null($author$project$Main$Nil),
				A4(
				$elm$json$Json$Decode$map3,
				$author$project$Main$AST,
				A2($elm$json$Json$Decode$field, 'node', $author$project$Main$nodeDecode),
				A2(
					$elm$json$Json$Decode$field,
					'left',
					$elm$json$Json$Decode$lazy(
						function (_v0) {
							return $author$project$Main$cyclic$astDecode();
						})),
				A2(
					$elm$json$Json$Decode$field,
					'right',
					$elm$json$Json$Decode$lazy(
						function (_v1) {
							return $author$project$Main$cyclic$astDecode();
						})))
			]));
}
try {
	var $author$project$Main$astDecode = $author$project$Main$cyclic$astDecode();
	$author$project$Main$cyclic$astDecode = function () {
		return $author$project$Main$astDecode;
	};
} catch ($) {
	throw 'Some top-level definitions from `Main` are causing infinite recursion:\n\n  ┌─────┐\n  │    astDecode\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $author$project$Main$astneDecode = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Main$ASTne,
	A2($elm$json$Json$Decode$field, 'node', $author$project$Main$nodeDecode),
	A2($elm$json$Json$Decode$field, 'left', $author$project$Main$astDecode),
	A2($elm$json$Json$Decode$field, 'right', $author$project$Main$astDecode));
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$Main$positionDecode = A3(
	$elm$json$Json$Decode$map2,
	$elm$core$Tuple$pair,
	A2($elm$json$Json$Decode$field, 'x', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'y', $elm$json$Json$Decode$float));
var $author$project$Main$astxyDecode = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Main$ASTxy,
	A2($elm$json$Json$Decode$field, 'position', $author$project$Main$positionDecode),
	A2($elm$json$Json$Decode$field, 'astne', $author$project$Main$astneDecode));
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$Main$astRootsDecode = $elm$json$Json$Decode$list($author$project$Main$astxyDecode);
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $author$project$Main$loadProgram = F2(
	function (json, model) {
		var _v0 = A2($elm$json$Json$Decode$decodeString, $author$project$Main$astRootsDecode, json);
		if (_v0.$ === 'Ok') {
			var roots = _v0.a;
			var names = A3(
				$elm$core$List$foldl,
				F2(
					function (_v1, ls) {
						var _v2 = _v1.b;
						var node = _v2.a;
						if (_Utils_eq(node.getBrickType, $author$project$Main$EntryBrick)) {
							var _v3 = node.getText;
							if (_v3.$ === 'Name') {
								var name = _v3.a;
								return A2($elm$core$List$cons, name, ls);
							} else {
								return ls;
							}
						} else {
							return ls;
						}
					}),
				_List_fromArray(
					['usagi', 'kuma']),
				roots);
			return _Utils_update(
				model,
				{
					getASTRoots: roots,
					routineNames: $elm$core$Set$fromList(names),
					turtle: $author$project$Main$clearTurtle(model.turtle)
				});
		} else {
			return model;
		}
	});
var $elm$core$Debug$log = _Debug_log;
var $author$project$Main$makeNewRoutine = function (model) {
	var newEntryBrick = {
		getBrickCommand: $author$project$Main$CommandNOP,
		getBrickType: $author$project$Main$EntryBrick,
		getText: $author$project$Main$Name(model.routineBox)
	};
	var newRoot = A2(
		$author$project$Main$ASTxy,
		_Utils_Tuple2(300, 100),
		A3($author$project$Main$ASTne, newEntryBrick, $author$project$Main$Nil, $author$project$Main$Nil));
	var isEntryExist = A2(
		$elm$core$List$any,
		function (_v0) {
			var _v1 = _v0.b;
			var node = _v1.a;
			return _Utils_eq(node.getBrickType, $author$project$Main$EntryBrick) && _Utils_eq(
				node.getText,
				$author$project$Main$Name(model.routineBox));
		},
		model.getASTRoots);
	var addedModel = A2($author$project$Main$addASTxy, newRoot, model);
	return ((model.routineBox !== '') && (!isEntryExist)) ? _Utils_update(
		addedModel,
		{
			routineBox: '',
			routineNames: A2($elm$core$Set$insert, model.routineBox, model.routineNames)
		}) : model;
};
var $author$project$Main$isFloat = function (str) {
	var _v0 = $elm$core$String$toFloat(str);
	if (_v0.$ === 'Just') {
		return true;
	} else {
		if (str === '-') {
			return true;
		} else {
			return $elm$core$String$isEmpty(str);
		}
	}
};
var $author$project$Main$modifyInitHeading = F2(
	function (heading, model) {
		if (!_Utils_eq(model.turtle.state, $author$project$Main$Done)) {
			return model;
		} else {
			var newHeadingBox = $author$project$Main$isFloat(heading) ? heading : model.initHeadingBox;
			var newHeading = function () {
				var _v0 = $elm$core$String$toFloat(newHeadingBox);
				if (_v0.$ === 'Just') {
					var num = _v0.a;
					return num;
				} else {
					return model.turtle.heading;
				}
			}();
			var modifyTurtle = function (turtle) {
				return _Utils_update(
					turtle,
					{initHeading: newHeading});
			};
			return _Utils_update(
				model,
				{
					initHeadingBox: newHeadingBox,
					turtle: $author$project$Main$clearTurtle(
						modifyTurtle(model.turtle))
				});
		}
	});
var $author$project$Main$modifyInitX = F2(
	function (x, model) {
		if (!_Utils_eq(model.turtle.state, $author$project$Main$Done)) {
			return model;
		} else {
			var newXBox = $author$project$Main$isFloat(x) ? x : model.initXBox;
			var newX = function () {
				var _v0 = $elm$core$String$toFloat(newXBox);
				if (_v0.$ === 'Just') {
					var num = _v0.a;
					return num;
				} else {
					return model.turtle.x;
				}
			}();
			var modifyTurtle = function (turtle) {
				return _Utils_update(
					turtle,
					{initX: newX});
			};
			return _Utils_update(
				model,
				{
					initXBox: newXBox,
					turtle: $author$project$Main$clearTurtle(
						modifyTurtle(model.turtle))
				});
		}
	});
var $author$project$Main$modifyInitY = F2(
	function (y, model) {
		if (!_Utils_eq(model.turtle.state, $author$project$Main$Done)) {
			return model;
		} else {
			var newYBox = $author$project$Main$isFloat(y) ? y : model.initYBox;
			var newY = function () {
				var _v0 = $elm$core$String$toFloat(newYBox);
				if (_v0.$ === 'Just') {
					var num = _v0.a;
					return num;
				} else {
					return model.turtle.y;
				}
			}();
			var modifyTurtle = function (turtle) {
				return _Utils_update(
					turtle,
					{initY: newY});
			};
			return _Utils_update(
				model,
				{
					initYBox: newYBox,
					turtle: $author$project$Main$clearTurtle(
						modifyTurtle(model.turtle))
				});
		}
	});
var $author$project$Main$discardC = function (cx) {
	if (cx.$ === 'Changed') {
		var x = cx.a;
		return x;
	} else {
		var x = cx.a;
		return x;
	}
};
var $author$project$Main$modifyText = F5(
	function (func, theXY, place, newText, model) {
		var traverse = F2(
			function (xy, ast) {
				if (ast.$ === 'Nil') {
					return $author$project$Main$Unchanged($author$project$Main$Nil);
				} else {
					var n = ast.a;
					var b = ast.b;
					var r = ast.c;
					return A2($author$project$Main$insideBrick, xy, theXY) ? $author$project$Main$Changed(
						A3(
							$author$project$Main$AST,
							_Utils_update(
								n,
								{
									getText: A3(func, n.getText, place, newText)
								}),
							b,
							r)) : A2(
						$author$project$Main$mapC,
						$author$project$Main$asAST,
						A5(
							$author$project$Main$fanOut,
							$author$project$Main$interval(model),
							traverse,
							traverse,
							xy,
							A3($author$project$Main$ASTne, n, b, r)));
				}
			});
		return _Utils_update(
			model,
			{
				getASTRoots: $author$project$Main$discardC(
					A2(
						$author$project$Main$changeOnce,
						function (_v1) {
							var xy = _v1.a;
							var ast = _v1.b;
							var n = ast.a;
							var b = ast.b;
							var r = ast.c;
							return A2($author$project$Main$insideBrick, xy, theXY) ? $author$project$Main$Changed(
								A2(
									$author$project$Main$ASTxy,
									xy,
									A3(
										$author$project$Main$ASTne,
										_Utils_update(
											n,
											{
												getText: A3(func, n.getText, place, newText)
											}),
										b,
										r))) : A2(
								$author$project$Main$mapC,
								$author$project$Main$ASTxy(xy),
								A5(
									$author$project$Main$fanOut,
									$author$project$Main$interval(model),
									traverse,
									traverse,
									xy,
									ast));
						},
						model.getASTRoots))
			});
	});
var $author$project$Main$isVariable = function (str) {
	var isInitAlpha = function () {
		var _v0 = $elm$core$String$uncons(str);
		if (_v0.$ === 'Just') {
			var _v1 = _v0.a;
			var c = _v1.a;
			return $elm$core$Char$isAlpha(c);
		} else {
			return false;
		}
	}();
	return (isInitAlpha && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, str)) || $elm$core$String$isEmpty(str);
};
var $author$project$Main$strictType = F3(
	function (old, _new, list) {
		return A2(
			$elm$core$List$any,
			function (f) {
				return f(_new);
			},
			list) ? _new : old;
	});
var $author$project$Main$stringToOp = function (str) {
	switch (str) {
		case 'Add':
			return $elm$core$Maybe$Just($author$project$Main$Add);
		case 'Sub':
			return $elm$core$Maybe$Just($author$project$Main$Sub);
		case 'Mul':
			return $elm$core$Maybe$Just($author$project$Main$Mul);
		case 'Div':
			return $elm$core$Maybe$Just($author$project$Main$Div);
		case 'Quotient':
			return $elm$core$Maybe$Just($author$project$Main$Quotient);
		case 'Mod':
			return $elm$core$Maybe$Just($author$project$Main$Mod);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$modifyCalc = F3(
	function (text, place, _new) {
		if (text.$ === 'Calc') {
			var _var = text.a;
			var val1 = text.b;
			var op = text.c;
			var val2 = text.d;
			switch (place) {
				case 1:
					return A4(
						$author$project$Main$Calc,
						A3(
							$author$project$Main$strictType,
							_var,
							_new,
							_List_fromArray(
								[$author$project$Main$isVariable])),
						val1,
						op,
						val2);
				case 2:
					return A4(
						$author$project$Main$Calc,
						_var,
						A3(
							$author$project$Main$strictType,
							val1,
							_new,
							_List_fromArray(
								[$author$project$Main$isFloat, $author$project$Main$isVariable])),
						op,
						val2);
				case 3:
					var _v2 = $author$project$Main$stringToOp(_new);
					if (_v2.$ === 'Just') {
						var newOp = _v2.a;
						return A4($author$project$Main$Calc, _var, val1, newOp, val2);
					} else {
						return text;
					}
				case 4:
					return A4(
						$author$project$Main$Calc,
						_var,
						val1,
						op,
						A3(
							$author$project$Main$strictType,
							val2,
							_new,
							_List_fromArray(
								[$author$project$Main$isFloat, $author$project$Main$isVariable])));
				default:
					return text;
			}
		} else {
			return text;
		}
	});
var $author$project$Main$isString = function (str) {
	return A2($elm$core$String$startsWith, '\"', str) || $elm$core$String$isEmpty(str);
};
var $author$project$Main$stringToCp = function (str) {
	switch (str) {
		case 'Eq':
			return $elm$core$Maybe$Just($author$project$Main$Eq);
		case 'Ne':
			return $elm$core$Maybe$Just($author$project$Main$Ne);
		case 'Gt':
			return $elm$core$Maybe$Just($author$project$Main$Gt);
		case 'Lt':
			return $elm$core$Maybe$Just($author$project$Main$Lt);
		case 'Ge':
			return $elm$core$Maybe$Just($author$project$Main$Ge);
		case 'Le':
			return $elm$core$Maybe$Just($author$project$Main$Le);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$modifyCond = F3(
	function (text, place, _new) {
		if (text.$ === 'Cond') {
			var val1 = text.a;
			var cp = text.b;
			var val2 = text.c;
			switch (place) {
				case 1:
					return A3(
						$author$project$Main$Cond,
						A3(
							$author$project$Main$strictType,
							val1,
							_new,
							_List_fromArray(
								[$author$project$Main$isFloat, $author$project$Main$isString, $author$project$Main$isVariable])),
						cp,
						val2);
				case 2:
					var _v2 = $author$project$Main$stringToCp(_new);
					if (_v2.$ === 'Just') {
						var newCp = _v2.a;
						return A3($author$project$Main$Cond, val1, newCp, val2);
					} else {
						return text;
					}
				case 3:
					return A3(
						$author$project$Main$Cond,
						val1,
						cp,
						A3(
							$author$project$Main$strictType,
							val2,
							_new,
							_List_fromArray(
								[$author$project$Main$isFloat, $author$project$Main$isString, $author$project$Main$isVariable])));
				default:
					return text;
			}
		} else {
			return text;
		}
	});
var $author$project$Main$modifyInit = F3(
	function (text, place, _new) {
		if (text.$ === 'Init') {
			var _var = text.a;
			var val = text.b;
			switch (place) {
				case 1:
					return A2(
						$author$project$Main$Init,
						A3(
							$author$project$Main$strictType,
							_var,
							_new,
							_List_fromArray(
								[$author$project$Main$isVariable])),
						val);
				case 2:
					return A2(
						$author$project$Main$Init,
						_var,
						A3(
							$author$project$Main$strictType,
							val,
							_new,
							_List_fromArray(
								[$author$project$Main$isFloat, $author$project$Main$isString, $author$project$Main$isVariable])));
				default:
					return text;
			}
		} else {
			return text;
		}
	});
var $author$project$Main$modifyName = F3(
	function (text, place, _new) {
		if (text.$ === 'Name') {
			if (place === 1) {
				return $author$project$Main$Name(_new);
			} else {
				return text;
			}
		} else {
			return text;
		}
	});
var $author$project$Main$modifyParam = F3(
	function (text, place, _new) {
		if (text.$ === 'Param') {
			var val = text.a;
			if (place === 1) {
				return $author$project$Main$Param(
					A3(
						$author$project$Main$strictType,
						val,
						_new,
						_List_fromArray(
							[$author$project$Main$isFloat, $author$project$Main$isVariable])));
			} else {
				return text;
			}
		} else {
			return text;
		}
	});
var $author$project$Main$modifyPop = F3(
	function (text, place, _new) {
		if (text.$ === 'Pop') {
			var _var = text.a;
			if (place === 1) {
				return $author$project$Main$Pop(
					A3(
						$author$project$Main$strictType,
						_var,
						_new,
						_List_fromArray(
							[$author$project$Main$isVariable])));
			} else {
				return text;
			}
		} else {
			return text;
		}
	});
var $author$project$Main$modifyPush = F3(
	function (text, place, _new) {
		if (text.$ === 'Push') {
			var val = text.a;
			if (place === 1) {
				return $author$project$Main$Push(
					A3(
						$author$project$Main$strictType,
						val,
						_new,
						_List_fromArray(
							[$author$project$Main$isFloat, $author$project$Main$isString, $author$project$Main$isVariable])));
			} else {
				return text;
			}
		} else {
			return text;
		}
	});
var $author$project$Main$modifyTextData = F3(
	function (text, place, _new) {
		switch (text.$) {
			case 'Name':
				return A3($author$project$Main$modifyName, text, place, _new);
			case 'Param':
				return A3($author$project$Main$modifyParam, text, place, _new);
			case 'Init':
				return A3($author$project$Main$modifyInit, text, place, _new);
			case 'Calc':
				return A3($author$project$Main$modifyCalc, text, place, _new);
			case 'Cond':
				return A3($author$project$Main$modifyCond, text, place, _new);
			case 'Push':
				return A3($author$project$Main$modifyPush, text, place, _new);
			case 'Pop':
				return A3($author$project$Main$modifyPop, text, place, _new);
			default:
				return text;
		}
	});
var $author$project$Main$Waiting = {$: 'Waiting'};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$Basics$cos = _Basics_cos;
var $elm$core$Basics$pi = _Basics_pi;
var $elm$core$Basics$degrees = function (angleInDegrees) {
	return (angleInDegrees * $elm$core$Basics$pi) / 180;
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Main$setEndpoint = F3(
	function (x, y, lines) {
		return _Utils_ap(
			A2(
				$elm$core$List$take,
				$elm$core$List$length(lines) - 2,
				lines),
			_List_fromArray(
				[
					$elm$core$String$fromFloat(x),
					$elm$core$String$fromFloat(y)
				]));
	});
var $elm$core$Basics$sin = _Basics_sin;
var $author$project$Main$move_forward = F2(
	function (delta, turtle) {
		if (!turtle.forward_remaining) {
			return turtle;
		} else {
			if (_Utils_cmp(
				$elm$core$Basics$abs(turtle.forward_remaining),
				$elm$core$Basics$abs(turtle.velocity * delta)) > 0) {
				var newY = turtle.y + (($elm$core$Basics$sin(
					$elm$core$Basics$degrees(turtle.heading)) * turtle.velocity) * delta);
				var newX = turtle.x + (($elm$core$Basics$cos(
					$elm$core$Basics$degrees(turtle.heading)) * turtle.velocity) * delta);
				var newLines = _Utils_eq(turtle.penState, $author$project$Main$Down) ? A3($author$project$Main$setEndpoint, newX + (turtle.w / 2), newY + (turtle.w / 2), turtle.lines) : turtle.lines;
				return _Utils_update(
					turtle,
					{forward_remaining: turtle.forward_remaining - (turtle.velocity * delta), lines: newLines, x: newX, y: newY});
			} else {
				var newY = turtle.y + ($elm$core$Basics$sin(
					$elm$core$Basics$degrees(turtle.heading)) * turtle.forward_remaining);
				var newX = turtle.x + ($elm$core$Basics$cos(
					$elm$core$Basics$degrees(turtle.heading)) * turtle.forward_remaining);
				var newLines = _Utils_eq(turtle.penState, $author$project$Main$Down) ? A3($author$project$Main$setEndpoint, newX + (turtle.w / 2), newY + (turtle.w / 2), turtle.lines) : turtle.lines;
				return _Utils_update(
					turtle,
					{
						forward_remaining: 0,
						lines: newLines,
						x: turtle.x + ($elm$core$Basics$cos(
							$elm$core$Basics$degrees(turtle.heading)) * turtle.forward_remaining),
						y: turtle.y + ($elm$core$Basics$sin(
							$elm$core$Basics$degrees(turtle.heading)) * turtle.forward_remaining)
					});
			}
		}
	});
var $author$project$Main$move_turn = F2(
	function (delta, turtle) {
		return (!turtle.turn_remaining) ? turtle : ((_Utils_cmp(
			$elm$core$Basics$abs(turtle.turn_remaining),
			$elm$core$Basics$abs(turtle.avelocity * delta)) > 0) ? _Utils_update(
			turtle,
			{heading: turtle.heading + (turtle.avelocity * delta), turn_remaining: turtle.turn_remaining - (turtle.avelocity * delta)}) : _Utils_update(
			turtle,
			{heading: turtle.heading + turtle.turn_remaining, turn_remaining: 0}));
	});
var $author$project$Main$move_wait = F2(
	function (delta, turtle) {
		return (_Utils_cmp(turtle.wait_remaining, delta) > 0) ? _Utils_update(
			turtle,
			{wait_remaining: turtle.wait_remaining - delta}) : _Utils_update(
			turtle,
			{wait_remaining: 0});
	});
var $author$project$Main$MsgRun = {$: 'MsgRun'};
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$core$Process$sleep = _Process_sleep;
var $author$project$Main$proceed = A2(
	$elm$core$Task$perform,
	$elm$core$Basics$always($author$project$Main$MsgRun),
	$elm$core$Process$sleep(0));
var $author$project$Main$move = F2(
	function (delta, model) {
		var new_turtle = A2(
			$author$project$Main$move_turn,
			delta,
			A2(
				$author$project$Main$move_forward,
				delta,
				A2($author$project$Main$move_wait, delta, model.turtle)));
		return ((!new_turtle.wait_remaining) && ((!new_turtle.forward_remaining) && ((!new_turtle.turn_remaining) && _Utils_eq(new_turtle.state, $author$project$Main$Running)))) ? _Utils_Tuple2(
			_Utils_update(
				model,
				{
					turtle: _Utils_update(
						new_turtle,
						{state: $author$project$Main$Waiting})
				}),
			$author$project$Main$proceed) : _Utils_Tuple2(
			_Utils_update(
				model,
				{turtle: new_turtle}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Main$moveUs = F2(
	function (_v0, model) {
		var mouseX = _v0.a;
		var mouseY = _v0.b;
		var _v1 = model.getDnDInfo.getRootXY;
		var rootX0 = _v1.a;
		var rootY0 = _v1.b;
		var _v2 = model.getDnDInfo.getMouseXY;
		var mouseX0 = _v2.a;
		var mouseY0 = _v2.b;
		var rootX = (rootX0 + mouseX) - mouseX0;
		var rootY = (rootY0 + mouseY) - mouseY0;
		var newInfo = {
			getMouseXY: _Utils_Tuple2(mouseX, mouseY),
			getOnDnD: true,
			getRootXY: _Utils_Tuple2(rootX, rootY)
		};
		return _Utils_update(
			model,
			{
				getASTRoots: $elm$core$List$reverse(
					$author$project$Main$discardC(
						A2(
							$author$project$Main$changeOnce,
							function (_v3) {
								var p = _v3.a;
								var a = _v3.b;
								return _Utils_eq(
									p,
									_Utils_Tuple2(rootX0, rootY0)) ? $author$project$Main$Changed(
									A2(
										$author$project$Main$ASTxy,
										_Utils_Tuple2(rootX, rootY),
										a)) : $author$project$Main$Unchanged(
									A2($author$project$Main$ASTxy, p, a));
							},
							$elm$core$List$reverse(model.getASTRoots)))),
				getDnDInfo: newInfo
			});
	});
var $author$project$Main$getRoutine = F2(
	function (roots, name) {
		getRoutine:
		while (true) {
			if (!roots.b) {
				return $author$project$Main$Nil;
			} else {
				var _v1 = roots.a;
				var ast = _v1.b;
				var node = ast.a;
				var remain = roots.b;
				if (_Utils_eq(node.getBrickType, $author$project$Main$EntryBrick) && _Utils_eq(node.getText, name)) {
					return $author$project$Main$asAST(ast);
				} else {
					var $temp$roots = remain,
						$temp$name = name;
					roots = $temp$roots;
					name = $temp$name;
					continue getRoutine;
				}
			}
		}
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$next = F2(
	function (roots, turtle) {
		next:
		while (true) {
			var _v0 = turtle.state;
			switch (_v0.$) {
				case 'Start':
					var _v1 = $elm$core$List$head(
						$elm$core$List$reverse(roots));
					if (_v1.$ === 'Nothing') {
						return _Utils_update(
							turtle,
							{current: $author$project$Main$Nil});
					} else {
						var _v2 = _v1.a;
						var astne = _v2.b;
						return _Utils_update(
							turtle,
							{
								current: $author$project$Main$asAST(astne),
								state: $author$project$Main$Waiting
							});
					}
				case 'Waiting':
					var _v3 = turtle.current;
					if (_v3.$ === 'Nil') {
						var _v4 = turtle.callStack;
						if (!_v4.b) {
							return _Utils_update(
								turtle,
								{current: $author$project$Main$Nil});
						} else {
							var _v5 = _v4.a;
							var retCurrent = _v5.a;
							var retVariables = _v5.b;
							var remain = _v4.b;
							return _Utils_update(
								turtle,
								{callStack: remain, current: retCurrent, variables: retVariables});
						}
					} else {
						var node = _v3.a;
						var left = _v3.b;
						var right = _v3.c;
						var _v6 = node.getBrickType;
						if (_v6.$ === 'CallBrick') {
							var _v7 = A2($author$project$Main$getRoutine, roots, node.getText);
							if (_v7.$ === 'Nil') {
								if (_Utils_eq(left, $author$project$Main$Nil) && _Utils_eq(right, $author$project$Main$Nil)) {
									var $temp$roots = roots,
										$temp$turtle = _Utils_update(
										turtle,
										{current: $author$project$Main$Nil});
									roots = $temp$roots;
									turtle = $temp$turtle;
									continue next;
								} else {
									return _Utils_update(
										turtle,
										{
											current: (!_Utils_eq(left, $author$project$Main$Nil)) ? left : right
										});
								}
							} else {
								var ast = _v7;
								return (_Utils_eq(left, $author$project$Main$Nil) && _Utils_eq(right, $author$project$Main$Nil)) ? _Utils_update(
									turtle,
									{current: ast, variables: $elm$core$Dict$empty}) : _Utils_update(
									turtle,
									{
										callStack: A2(
											$elm$core$List$cons,
											_Utils_Tuple2(
												(!_Utils_eq(left, $author$project$Main$Nil)) ? left : right,
												turtle.variables),
											turtle.callStack),
										current: ast,
										variables: $elm$core$Dict$empty
									});
							}
						} else {
							if (_Utils_eq(left, $author$project$Main$Nil) && _Utils_eq(right, $author$project$Main$Nil)) {
								var $temp$roots = roots,
									$temp$turtle = _Utils_update(
									turtle,
									{current: $author$project$Main$Nil});
								roots = $temp$roots;
								turtle = $temp$turtle;
								continue next;
							} else {
								return _Utils_update(
									turtle,
									{
										current: (!_Utils_eq(left, $author$project$Main$Nil)) ? left : right
									});
							}
						}
					}
				default:
					return turtle;
			}
		}
	});
var $author$project$Main$FloatValue = function (a) {
	return {$: 'FloatValue', a: a};
};
var $author$project$Main$remainder = F2(
	function (a, b) {
		var q = $elm$core$Basics$floor(a / b);
		var r = a - (b * q);
		return r;
	});
var $author$project$Main$calculate = F3(
	function (num1, op, num2) {
		switch (op.$) {
			case 'Add':
				return num1 + num2;
			case 'Sub':
				return num1 - num2;
			case 'Mul':
				return num1 * num2;
			case 'Div':
				return num1 / num2;
			case 'Quotient':
				return $elm$core$Basics$floor(num1 / num2);
			default:
				return A2($author$project$Main$remainder, num1, num2);
		}
	});
var $author$project$Main$StringValue = function (a) {
	return {$: 'StringValue', a: a};
};
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Main$deleteDblquote = function (str) {
	return (A2($elm$core$String$startsWith, '\"', str) && (A2($elm$core$String$endsWith, '\"', str) && ($elm$core$String$length(str) >= 2))) ? A2(
		$elm$core$String$dropRight,
		1,
		A2($elm$core$String$dropLeft, 1, str)) : str;
};
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $author$project$Main$getValue = F2(
	function (str, variables) {
		var _v0 = $elm$core$String$toFloat(str);
		if (_v0.$ === 'Just') {
			var num = _v0.a;
			return $elm$core$Maybe$Just(
				$author$project$Main$FloatValue(num));
		} else {
			return (A2($elm$core$String$startsWith, '\"', str) && (A2($elm$core$String$endsWith, '\"', str) && ($elm$core$String$length(str) >= 2))) ? $elm$core$Maybe$Just(
				$author$project$Main$StringValue(
					$author$project$Main$deleteDblquote(str))) : A2($elm$core$Dict$get, str, variables);
		}
	});
var $author$project$Main$run_calculate = F2(
	function (text, turtle) {
		if (text.$ === 'Calc') {
			var _var = text.a;
			var str1 = text.b;
			var op = text.c;
			var str2 = text.d;
			if ($elm$core$String$isEmpty(_var) || (!$author$project$Main$isVariable(_var))) {
				return turtle;
			} else {
				var num2 = function () {
					var _v2 = A2($author$project$Main$getValue, str2, turtle.variables);
					if ((_v2.$ === 'Just') && (_v2.a.$ === 'FloatValue')) {
						var num = _v2.a.a;
						return num;
					} else {
						return 0;
					}
				}();
				var num1 = function () {
					var _v1 = A2($author$project$Main$getValue, str1, turtle.variables);
					if ((_v1.$ === 'Just') && (_v1.a.$ === 'FloatValue')) {
						var num = _v1.a.a;
						return num;
					} else {
						return 0;
					}
				}();
				var newVariables = A3(
					$elm$core$Dict$insert,
					_var,
					$author$project$Main$FloatValue(
						A3($author$project$Main$calculate, num1, op, num2)),
					turtle.variables);
				return _Utils_update(
					turtle,
					{variables: newVariables});
			}
		} else {
			return turtle;
		}
	});
var $author$project$Main$compare = F3(
	function (val1, cp, val2) {
		switch (cp.$) {
			case 'Eq':
				return _Utils_eq(val1, val2);
			case 'Ne':
				return !_Utils_eq(val1, val2);
			case 'Gt':
				return _Utils_cmp(val1, val2) > 0;
			case 'Lt':
				return _Utils_cmp(val1, val2) < 0;
			case 'Ge':
				return _Utils_cmp(val1, val2) > -1;
			default:
				return _Utils_cmp(val1, val2) < 1;
		}
	});
var $author$project$Main$run_case = F2(
	function (text, turtle) {
		if (text.$ === 'Cond') {
			var str1 = text.a;
			var cp = text.b;
			var str2 = text.c;
			var result = function () {
				var _v2 = A2($author$project$Main$getValue, str1, turtle.variables);
				if (_v2.$ === 'Just') {
					if (_v2.a.$ === 'FloatValue') {
						var num1 = _v2.a.a;
						var _v3 = A2($author$project$Main$getValue, str2, turtle.variables);
						if ((_v3.$ === 'Just') && (_v3.a.$ === 'FloatValue')) {
							var num2 = _v3.a.a;
							return A3($author$project$Main$compare, num1, cp, num2);
						} else {
							return false;
						}
					} else {
						var string1 = _v2.a.a;
						var _v4 = A2($author$project$Main$getValue, str2, turtle.variables);
						if ((_v4.$ === 'Just') && (_v4.a.$ === 'StringValue')) {
							var string2 = _v4.a.a;
							return A3($author$project$Main$compare, string1, cp, string2);
						} else {
							return false;
						}
					}
				} else {
					return false;
				}
			}();
			var modifiedCurrent = function () {
				var _v1 = turtle.current;
				if (_v1.$ === 'Nil') {
					return $author$project$Main$Nil;
				} else {
					var node = _v1.a;
					var left = _v1.b;
					var right = _v1.c;
					return result ? A3($author$project$Main$AST, node, $author$project$Main$Nil, right) : A3($author$project$Main$AST, node, left, $author$project$Main$Nil);
				}
			}();
			return _Utils_update(
				turtle,
				{current: modifiedCurrent});
		} else {
			return turtle;
		}
	});
var $author$project$Main$getSign = function (num) {
	return (num >= 0) ? 1 : (-1);
};
var $author$project$Main$run_forward = F3(
	function (isForward, text, turtle) {
		if (text.$ === 'Param') {
			var str = text.a;
			var _v1 = A2($author$project$Main$getValue, str, turtle.variables);
			if ((_v1.$ === 'Just') && (_v1.a.$ === 'FloatValue')) {
				var num = _v1.a.a;
				var distance = isForward ? num : ((-1) * num);
				return _Utils_update(
					turtle,
					{
						forward_remaining: distance,
						lines: _Utils_eq(turtle.penState, $author$project$Main$Down) ? _Utils_ap(
							turtle.lines,
							_List_fromArray(
								[
									'M',
									$elm$core$String$fromFloat(turtle.x + (turtle.w / 2)),
									$elm$core$String$fromFloat(turtle.y + (turtle.w / 2)),
									'L',
									$elm$core$String$fromFloat(turtle.x + (turtle.w / 2)),
									$elm$core$String$fromFloat(turtle.y + (turtle.w / 2))
								])) : turtle.lines,
						state: $author$project$Main$Running,
						velocity: $author$project$Main$getSign(distance) * $elm$core$Basics$abs(turtle.velocity)
					});
			} else {
				return turtle;
			}
		} else {
			return turtle;
		}
	});
var $author$project$Main$run_init = F2(
	function (text, turtle) {
		if (text.$ === 'Init') {
			var _var = text.a;
			var str = text.b;
			if ($elm$core$String$isEmpty(_var) || (!$author$project$Main$isVariable(_var))) {
				return turtle;
			} else {
				var newVariables = function () {
					var _v1 = A2($author$project$Main$getValue, str, turtle.variables);
					if (_v1.$ === 'Just') {
						var val = _v1.a;
						return A3($elm$core$Dict$insert, _var, val, turtle.variables);
					} else {
						return turtle.variables;
					}
				}();
				return _Utils_update(
					turtle,
					{variables: newVariables});
			}
		} else {
			return turtle;
		}
	});
var $author$project$Main$run_pen = F2(
	function (text, turtle) {
		if (text.$ === 'Pen') {
			var state = text.a;
			return _Utils_update(
				turtle,
				{penState: state});
		} else {
			return turtle;
		}
	});
var $author$project$Main$run_pop = F2(
	function (text, turtle) {
		if (text.$ === 'Pop') {
			var _var = text.a;
			if ($elm$core$String$isEmpty(_var) || (!$author$project$Main$isVariable(_var))) {
				return turtle;
			} else {
				var _v1 = turtle.stack;
				if (!_v1.b) {
					return turtle;
				} else {
					var val = _v1.a;
					var remain = _v1.b;
					return _Utils_update(
						turtle,
						{
							stack: remain,
							variables: A3($elm$core$Dict$insert, _var, val, turtle.variables)
						});
				}
			}
		} else {
			return turtle;
		}
	});
var $author$project$Main$run_push = F2(
	function (text, turtle) {
		if (text.$ === 'Push') {
			var str = text.a;
			var _v1 = A2($author$project$Main$getValue, str, turtle.variables);
			if (_v1.$ === 'Nothing') {
				return turtle;
			} else {
				var val = _v1.a;
				return _Utils_update(
					turtle,
					{
						stack: A2($elm$core$List$cons, val, turtle.stack)
					});
			}
		} else {
			return turtle;
		}
	});
var $author$project$Main$run_turn = F3(
	function (isRight, text, turtle) {
		if (text.$ === 'Param') {
			var str = text.a;
			var _v1 = A2($author$project$Main$getValue, str, turtle.variables);
			if ((_v1.$ === 'Just') && (_v1.a.$ === 'FloatValue')) {
				var num = _v1.a.a;
				var angle = isRight ? num : ((-1) * num);
				return _Utils_update(
					turtle,
					{
						avelocity: $author$project$Main$getSign(angle) * $elm$core$Basics$abs(turtle.avelocity),
						state: $author$project$Main$Running,
						turn_remaining: angle
					});
			} else {
				return turtle;
			}
		} else {
			return turtle;
		}
	});
var $author$project$Main$run_wait = F2(
	function (text, turtle) {
		if (text.$ === 'Param') {
			var str = text.a;
			var _v1 = A2($author$project$Main$getValue, str, turtle.variables);
			if ((_v1.$ === 'Just') && (_v1.a.$ === 'FloatValue')) {
				var duration = _v1.a.a;
				return _Utils_update(
					turtle,
					{state: $author$project$Main$Running, wait_remaining: duration * 1000});
			} else {
				return turtle;
			}
		} else {
			return turtle;
		}
	});
var $author$project$Main$run = F2(
	function (limit, model) {
		run:
		while (true) {
			if (limit <= 0) {
				return _Utils_Tuple2(model, $author$project$Main$proceed);
			} else {
				var _v0 = model.turtle.state;
				switch (_v0.$) {
					case 'Running':
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					case 'Done':
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					default:
						var nextTurtle = A2($author$project$Main$next, model.getASTRoots, model.turtle);
						var newTurtle = function () {
							var _v2 = nextTurtle.current;
							if (_v2.$ === 'Nil') {
								return _Utils_update(
									nextTurtle,
									{state: $author$project$Main$Done});
							} else {
								var node = _v2.a;
								var _v3 = node.getBrickType;
								switch (_v3.$) {
									case 'BasicBrick':
										var _v4 = node.getBrickCommand;
										switch (_v4.$) {
											case 'CommandToioWait':
												return A2($author$project$Main$run_wait, node.getText, nextTurtle);
											case 'CommandToioMoveForward':
												return A3($author$project$Main$run_forward, true, node.getText, nextTurtle);
											case 'CommandToioMoveBackward':
												return A3($author$project$Main$run_forward, false, node.getText, nextTurtle);
											case 'CommandToioTurnLeft':
												return A3($author$project$Main$run_turn, false, node.getText, nextTurtle);
											case 'CommandToioTurnRight':
												return A3($author$project$Main$run_turn, true, node.getText, nextTurtle);
											case 'CommandPush':
												return A2($author$project$Main$run_push, node.getText, nextTurtle);
											case 'CommandPop':
												return A2($author$project$Main$run_pop, node.getText, nextTurtle);
											case 'CommandPenDown':
												return A2($author$project$Main$run_pen, node.getText, nextTurtle);
											case 'CommandPenUp':
												return A2($author$project$Main$run_pen, node.getText, nextTurtle);
											case 'CommandInit':
												return A2($author$project$Main$run_init, node.getText, nextTurtle);
											case 'CommandCalc':
												return A2($author$project$Main$run_calculate, node.getText, nextTurtle);
											default:
												return nextTurtle;
										}
									case 'CaseBrick':
										return A2($author$project$Main$run_case, node.getText, nextTurtle);
									default:
										return nextTurtle;
								}
							}
						}();
						var _v1 = newTurtle.state;
						if (_v1.$ === 'Waiting') {
							var $temp$limit = limit - 1,
								$temp$model = _Utils_update(
								model,
								{turtle: newTurtle});
							limit = $temp$limit;
							model = $temp$model;
							continue run;
						} else {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{turtle: newTurtle}),
								$elm$core$Platform$Cmd$none);
						}
				}
			}
		}
	});
var $author$project$Main$runLimit = 1000;
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Main$brickCommandEncode = function (brickCommand) {
	switch (brickCommand.$) {
		case 'CommandNOP':
			return $elm$json$Json$Encode$string('CommandNOP');
		case 'CommandCalc':
			return $elm$json$Json$Encode$string('CommandCalc');
		case 'CommandPop':
			return $elm$json$Json$Encode$string('CommandPop');
		case 'CommandPush':
			return $elm$json$Json$Encode$string('CommandPush');
		case 'CommandPenDown':
			return $elm$json$Json$Encode$string('CommandPenDown');
		case 'CommandPenUp':
			return $elm$json$Json$Encode$string('CommandPenUp');
		case 'CommandInit':
			return $elm$json$Json$Encode$string('CommandInit');
		case 'CommandToioWait':
			return $elm$json$Json$Encode$string('CommandToioWait');
		case 'CommandToioMoveForward':
			return $elm$json$Json$Encode$string('CommandToioMoveForward');
		case 'CommandToioMoveBackward':
			return $elm$json$Json$Encode$string('CommandToioMoveBackward');
		case 'CommandToioTurnLeft':
			return $elm$json$Json$Encode$string('CommandToioTurnLeft');
		case 'CommandToioTurnRight':
			return $elm$json$Json$Encode$string('CommandToioTurnRight');
		case 'CommandToioStopMoving':
			return $elm$json$Json$Encode$string('CommandToioStopMoving');
		case 'CommandToioPlayPresetSound':
			return $elm$json$Json$Encode$string('CommandToioPlayPresetSound');
		case 'CommandToioStopPlaying':
			return $elm$json$Json$Encode$string('CommandToioStopPlaying');
		case 'CommandToioTurnOnLED_Red':
			return $elm$json$Json$Encode$string('CommandToioTurnOnLED_Red');
		case 'CommandToioTurnOnLED_Blue':
			return $elm$json$Json$Encode$string('CommandToioTurnOnLED_Blue');
		case 'CommandToioTurnOnLED_Green':
			return $elm$json$Json$Encode$string('CommandToioTurnOnLED_Green');
		default:
			return $elm$json$Json$Encode$string('CommandToioTurnOffLED');
	}
};
var $author$project$Main$brickTypeEncode = function (brickType) {
	switch (brickType.$) {
		case 'BasicBrick':
			return $elm$json$Json$Encode$string('BasicBrick');
		case 'EntryBrick':
			return $elm$json$Json$Encode$string('EntryBrick');
		case 'CallBrick':
			return $elm$json$Json$Encode$string('CallBrick');
		case 'CaseBrick':
			return $elm$json$Json$Encode$string('CaseBrick');
		default:
			return $elm$json$Json$Encode$string('SpacerBrick');
	}
};
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $author$project$Main$cpToString = function (cp) {
	switch (cp.$) {
		case 'Eq':
			return 'Eq';
		case 'Ne':
			return 'Ne';
		case 'Gt':
			return 'Gt';
		case 'Lt':
			return 'Lt';
		case 'Ge':
			return 'Ge';
		default:
			return 'Le';
	}
};
var $author$project$Main$opToString = function (op) {
	switch (op.$) {
		case 'Add':
			return 'Add';
		case 'Sub':
			return 'Sub';
		case 'Mul':
			return 'Mul';
		case 'Div':
			return 'Div';
		case 'Quotient':
			return 'Quotient';
		default:
			return 'Mod';
	}
};
var $author$project$Main$penStateToStr = function (state) {
	if (state.$ === 'Up') {
		return 'Up';
	} else {
		return 'Down';
	}
};
var $author$project$Main$textEncode = function (text) {
	var spaceDecode = function (str) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'direction',
					$elm$json$Json$Encode$string(str))
				]));
	};
	var pushDecode = function (str) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'value',
					$elm$json$Json$Encode$string(str))
				]));
	};
	var popDecode = function (str) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'value',
					$elm$json$Json$Encode$string(str))
				]));
	};
	var penDecode = function (penState) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'penState',
					$elm$json$Json$Encode$string(
						$author$project$Main$penStateToStr(penState)))
				]));
	};
	var paramDecode = function (str) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'parameter',
					$elm$json$Json$Encode$string(str))
				]));
	};
	var nameDecode = function (str) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'name',
					$elm$json$Json$Encode$string(str))
				]));
	};
	var initDecode = F2(
		function (str1, str2) {
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'variable',
						$elm$json$Json$Encode$string(str1)),
						_Utils_Tuple2(
						'value',
						$elm$json$Json$Encode$string(str2))
					]));
		});
	var condDecode = F3(
		function (str1, cp, str2) {
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'value1',
						$elm$json$Json$Encode$string(str1)),
						_Utils_Tuple2(
						'comparator',
						$elm$json$Json$Encode$string(
							$author$project$Main$cpToString(cp))),
						_Utils_Tuple2(
						'value2',
						$elm$json$Json$Encode$string(str2))
					]));
		});
	var calcDecode = F4(
		function (str1, str2, op, str3) {
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'variable',
						$elm$json$Json$Encode$string(str1)),
						_Utils_Tuple2(
						'value1',
						$elm$json$Json$Encode$string(str2)),
						_Utils_Tuple2(
						'operator',
						$elm$json$Json$Encode$string(
							$author$project$Main$opToString(op))),
						_Utils_Tuple2(
						'value2',
						$elm$json$Json$Encode$string(str3))
					]));
		});
	switch (text.$) {
		case 'Name':
			var str = text.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'variant',
						$elm$json$Json$Encode$string('Name')),
						_Utils_Tuple2(
						'data',
						nameDecode(str))
					]));
		case 'Param':
			var str = text.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'variant',
						$elm$json$Json$Encode$string('Param')),
						_Utils_Tuple2(
						'data',
						paramDecode(str))
					]));
		case 'Pen':
			var penState = text.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'variant',
						$elm$json$Json$Encode$string('Pen')),
						_Utils_Tuple2(
						'data',
						penDecode(penState))
					]));
		case 'Push':
			var str = text.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'variant',
						$elm$json$Json$Encode$string('Push')),
						_Utils_Tuple2(
						'data',
						pushDecode(str))
					]));
		case 'Pop':
			var str = text.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'variant',
						$elm$json$Json$Encode$string('Pop')),
						_Utils_Tuple2(
						'data',
						popDecode(str))
					]));
		case 'Init':
			var str1 = text.a;
			var str2 = text.b;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'variant',
						$elm$json$Json$Encode$string('Init')),
						_Utils_Tuple2(
						'data',
						A2(initDecode, str1, str2))
					]));
		case 'Calc':
			var str1 = text.a;
			var str2 = text.b;
			var op = text.c;
			var str3 = text.d;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'variant',
						$elm$json$Json$Encode$string('Calc')),
						_Utils_Tuple2(
						'data',
						A4(calcDecode, str1, str2, op, str3))
					]));
		case 'Cond':
			var str1 = text.a;
			var cp = text.b;
			var str2 = text.c;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'variant',
						$elm$json$Json$Encode$string('Cond')),
						_Utils_Tuple2(
						'data',
						A3(condDecode, str1, cp, str2))
					]));
		default:
			var str = text.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'variant',
						$elm$json$Json$Encode$string('Space')),
						_Utils_Tuple2(
						'data',
						spaceDecode(str))
					]));
	}
};
var $author$project$Main$nodeEncode = function (_v0) {
	var getBrickType = _v0.getBrickType;
	var getBrickCommand = _v0.getBrickCommand;
	var getText = _v0.getText;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'getBrickType',
				$author$project$Main$brickTypeEncode(getBrickType)),
				_Utils_Tuple2(
				'getBrickCommand',
				$author$project$Main$brickCommandEncode(getBrickCommand)),
				_Utils_Tuple2(
				'getText',
				$author$project$Main$textEncode(getText))
			]));
};
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Main$astEncode = function (ast) {
	if (ast.$ === 'Nil') {
		return $elm$json$Json$Encode$null;
	} else {
		var node = ast.a;
		var left = ast.b;
		var right = ast.c;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'node',
					$author$project$Main$nodeEncode(node)),
					_Utils_Tuple2(
					'left',
					$author$project$Main$astEncode(left)),
					_Utils_Tuple2(
					'right',
					$author$project$Main$astEncode(right))
				]));
	}
};
var $author$project$Main$astneEncode = function (_v0) {
	var node = _v0.a;
	var left = _v0.b;
	var right = _v0.c;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'node',
				$author$project$Main$nodeEncode(node)),
				_Utils_Tuple2(
				'left',
				$author$project$Main$astEncode(left)),
				_Utils_Tuple2(
				'right',
				$author$project$Main$astEncode(right))
			]));
};
var $elm$json$Json$Encode$float = _Json_wrap;
var $author$project$Main$positionEncode = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'x',
				$elm$json$Json$Encode$float(x)),
				_Utils_Tuple2(
				'y',
				$elm$json$Json$Encode$float(y))
			]));
};
var $author$project$Main$astxyEncode = function (_v0) {
	var position = _v0.a;
	var astne = _v0.b;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'position',
				$author$project$Main$positionEncode(position)),
				_Utils_Tuple2(
				'astne',
				$author$project$Main$astneEncode(astne))
			]));
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $author$project$Main$astRootsEncode = function (roots) {
	return A2($elm$json$Json$Encode$list, $author$project$Main$astxyEncode, roots);
};
var $elm$file$File$Download$string = F3(
	function (name, mime, content) {
		return A2(
			$elm$core$Task$perform,
			$elm$core$Basics$never,
			A3(_File_download, name, mime, content));
	});
var $author$project$Main$saveProgram = function (roots) {
	return A3(
		$elm$file$File$Download$string,
		'program.json',
		'application/json',
		A2(
			$elm$json$Json$Encode$encode,
			4,
			$author$project$Main$astRootsEncode(roots)));
};
var $author$project$Main$startDnD = F3(
	function (rootXY, mouseXY, model) {
		return _Utils_update(
			model,
			{
				getASTRoots: function () {
					var theDnDRoot = A2(
						$elm$core$List$filter,
						function (_v1) {
							var p = _v1.a;
							return _Utils_eq(p, rootXY);
						},
						model.getASTRoots);
					var nonDnDRoots = A2(
						$elm$core$List$filter,
						function (_v0) {
							var p = _v0.a;
							return !_Utils_eq(p, rootXY);
						},
						model.getASTRoots);
					return _Utils_ap(nonDnDRoots, theDnDRoot);
				}(),
				getDnDInfo: {getMouseXY: mouseXY, getOnDnD: true, getRootXY: rootXY}
			});
	});
var $author$project$Main$stopDnD = F2(
	function (_v0, model) {
		var rootX = _v0.a;
		var rootY = _v0.b;
		return _Utils_update(
			model,
			{
				getASTRoots: (rootX < 150) ? A2(
					$elm$core$List$filter,
					function (_v1) {
						var p = _v1.a;
						return !_Utils_eq(
							p,
							_Utils_Tuple2(rootX, rootY));
					},
					model.getASTRoots) : model.getASTRoots,
				getDnDInfo: {
					getMouseXY: _Utils_Tuple2(0, 0),
					getOnDnD: false,
					getRootXY: _Utils_Tuple2(0, 0)
				}
			});
	});
var $elm$file$File$toString = _File_toString;
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'MsgCloneUs':
				var ast = msg.a;
				return A2(
					$elm$core$Debug$log,
					'MsgCloneUs received',
					_Utils_Tuple2(
						A2($author$project$Main$cloneUs, ast, model),
						$elm$core$Platform$Cmd$none));
			case 'NoAction':
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'MsgStartDnD':
				var rootXY = msg.a;
				var mouseXY = msg.b;
				return _Utils_Tuple2(
					A3($author$project$Main$startDnD, rootXY, mouseXY, model),
					$elm$core$Platform$Cmd$none);
			case 'MsgLetMeRoot':
				var _v1 = msg.a;
				var rootXY = _v1.a;
				var ast = _v1.b;
				var mouseXY = msg.b;
				return _Utils_Tuple2(
					A3(
						$author$project$Main$startDnD,
						rootXY,
						mouseXY,
						A2(
							$author$project$Main$letMeRoot,
							A2($author$project$Main$ASTxy, rootXY, ast),
							model)),
					$elm$core$Platform$Cmd$none);
			case 'MsgMoveUs':
				var mouseXY = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Main$moveUs, mouseXY, model),
					$elm$core$Platform$Cmd$none);
			case 'MsgAttachMe':
				var _v2 = msg.a;
				var rootXY = _v2.a;
				var ast = _v2.b;
				return _Utils_Tuple2(
					A2(
						$author$project$Main$attachMe,
						A2($author$project$Main$ASTxy, rootXY, ast),
						A2($author$project$Main$stopDnD, rootXY, model)),
					$elm$core$Platform$Cmd$none);
			case 'MsgInputChanged':
				var xy = msg.a;
				var place = msg.b;
				var text = msg.c;
				return _Utils_Tuple2(
					A5($author$project$Main$modifyText, $author$project$Main$modifyTextData, xy, place, text, model),
					$elm$core$Platform$Cmd$none);
			case 'MsgCheckString':
				var xy = msg.a;
				var place = msg.b;
				var text = msg.c;
				return _Utils_Tuple2(
					A5($author$project$Main$modifyText, $author$project$Main$completeDblquote, xy, place, text, model),
					$elm$core$Platform$Cmd$none);
			case 'MsgSetVarNames':
				return _Utils_Tuple2(
					$author$project$Main$getVarNames(model),
					$elm$core$Platform$Cmd$none);
			case 'MsgRoutineBoxChanged':
				var name = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{routineBox: name}),
					$elm$core$Platform$Cmd$none);
			case 'MsgMakeNewRoutine':
				return _Utils_Tuple2(
					$author$project$Main$makeNewRoutine(model),
					$elm$core$Platform$Cmd$none);
			case 'MsgInitXChanged':
				var str = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Main$modifyInitX, str, model),
					$elm$core$Platform$Cmd$none);
			case 'MsgInitYChanged':
				var str = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Main$modifyInitY, str, model),
					$elm$core$Platform$Cmd$none);
			case 'MsgInitHeadingChanged':
				var str = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Main$modifyInitHeading, str, model),
					$elm$core$Platform$Cmd$none);
			case 'MsgInitXBlur':
				return _Utils_Tuple2(
					$author$project$Main$checkInitX(model),
					$elm$core$Platform$Cmd$none);
			case 'MsgInitYBlur':
				return _Utils_Tuple2(
					$author$project$Main$checkInitY(model),
					$elm$core$Platform$Cmd$none);
			case 'MsgInitHeadingBlur':
				return _Utils_Tuple2(
					$author$project$Main$checkInitHeading(model),
					$elm$core$Platform$Cmd$none);
			case 'MsgDblClick':
				var getReady = function (turtle) {
					return _Utils_update(
						turtle,
						{state: $author$project$Main$Start});
				};
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							turtle: getReady(
								$author$project$Main$clearTurtle(model.turtle))
						}),
					$author$project$Main$proceed);
			case 'MsgTick':
				var delta = msg.a;
				return A2($author$project$Main$move, delta, model);
			case 'MsgRun':
				return A2($author$project$Main$run, $author$project$Main$runLimit, model);
			case 'MsgDownload':
				return _Utils_Tuple2(
					model,
					$author$project$Main$saveProgram(model.getASTRoots));
			case 'MsgRequested':
				return _Utils_Tuple2(
					model,
					A2(
						$elm$file$File$Select$file,
						_List_fromArray(
							['application/json']),
						$author$project$Main$MsgSelected));
			case 'MsgSelected':
				var file = msg.a;
				return _Utils_Tuple2(
					model,
					A2(
						$elm$core$Task$perform,
						$author$project$Main$MsgLoaded,
						$elm$file$File$toString(file)));
			case 'MsgLoaded':
				var content = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Main$loadProgram, content, model),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$MsgDownload = {$: 'MsgDownload'};
var $author$project$Main$MsgInitHeadingBlur = {$: 'MsgInitHeadingBlur'};
var $author$project$Main$MsgInitHeadingChanged = function (a) {
	return {$: 'MsgInitHeadingChanged', a: a};
};
var $author$project$Main$MsgInitXBlur = {$: 'MsgInitXBlur'};
var $author$project$Main$MsgInitXChanged = function (a) {
	return {$: 'MsgInitXChanged', a: a};
};
var $author$project$Main$MsgInitYBlur = {$: 'MsgInitYBlur'};
var $author$project$Main$MsgInitYChanged = function (a) {
	return {$: 'MsgInitYChanged', a: a};
};
var $author$project$Main$MsgMakeNewRoutine = {$: 'MsgMakeNewRoutine'};
var $author$project$Main$MsgMoveUs = function (a) {
	return {$: 'MsgMoveUs', a: a};
};
var $author$project$Main$MsgRequested = {$: 'MsgRequested'};
var $author$project$Main$MsgRoutineBoxChanged = function (a) {
	return {$: 'MsgRoutineBoxChanged', a: a};
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $author$project$Main$createNewRoot = function (_v0) {
	var _v1 = _v0.a;
	var x = _v1.a;
	var y = _v1.b;
	var node = _v0.b;
	return A2(
		$author$project$Main$ASTxy,
		_Utils_Tuple2(x, y),
		A3($author$project$Main$ASTne, node, $author$project$Main$Nil, $author$project$Main$Nil));
};
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$hidden = $elm$html$Html$Attributes$boolProperty('hidden');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNode;
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 'Custom', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$custom = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Custom(decoder));
	});
var $author$project$Main$on = function (eventName) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$json$Json$Decode$map(
			function (m) {
				return {message: m, preventDefault: false, stopPropagation: true};
			}),
		$elm$html$Html$Events$custom(eventName));
};
var $author$project$Main$pallet = _List_fromArray(
	[
		_Utils_Tuple2(
		_Utils_Tuple2(20, 100),
		{
			getBrickCommand: $author$project$Main$CommandToioMoveForward,
			getBrickType: $author$project$Main$BasicBrick,
			getText: $author$project$Main$Param('50')
		}),
		_Utils_Tuple2(
		_Utils_Tuple2(170, 100),
		{
			getBrickCommand: $author$project$Main$CommandToioMoveBackward,
			getBrickType: $author$project$Main$BasicBrick,
			getText: $author$project$Main$Param('50')
		}),
		_Utils_Tuple2(
		_Utils_Tuple2(20, 250),
		{
			getBrickCommand: $author$project$Main$CommandToioTurnLeft,
			getBrickType: $author$project$Main$BasicBrick,
			getText: $author$project$Main$Param('90')
		}),
		_Utils_Tuple2(
		_Utils_Tuple2(170, 250),
		{
			getBrickCommand: $author$project$Main$CommandToioTurnRight,
			getBrickType: $author$project$Main$BasicBrick,
			getText: $author$project$Main$Param('90')
		}),
		_Utils_Tuple2(
		_Utils_Tuple2(20, 400),
		{
			getBrickCommand: $author$project$Main$CommandNOP,
			getBrickType: $author$project$Main$CaseBrick,
			getText: A3($author$project$Main$Cond, '', $author$project$Main$Eq, '')
		}),
		_Utils_Tuple2(
		_Utils_Tuple2(20, 550),
		{
			getBrickCommand: $author$project$Main$CommandInit,
			getBrickType: $author$project$Main$BasicBrick,
			getText: A2($author$project$Main$Init, '', '')
		}),
		_Utils_Tuple2(
		_Utils_Tuple2(170, 550),
		{
			getBrickCommand: $author$project$Main$CommandCalc,
			getBrickType: $author$project$Main$BasicBrick,
			getText: A4($author$project$Main$Calc, '', '', $author$project$Main$Add, '')
		}),
		_Utils_Tuple2(
		_Utils_Tuple2(20, 700),
		{
			getBrickCommand: $author$project$Main$CommandPush,
			getBrickType: $author$project$Main$BasicBrick,
			getText: $author$project$Main$Push('')
		}),
		_Utils_Tuple2(
		_Utils_Tuple2(170, 700),
		{
			getBrickCommand: $author$project$Main$CommandPop,
			getBrickType: $author$project$Main$BasicBrick,
			getText: $author$project$Main$Pop('')
		}),
		_Utils_Tuple2(
		_Utils_Tuple2(20, 850),
		{
			getBrickCommand: $author$project$Main$CommandPenDown,
			getBrickType: $author$project$Main$BasicBrick,
			getText: $author$project$Main$Pen($author$project$Main$Down)
		}),
		_Utils_Tuple2(
		_Utils_Tuple2(170, 850),
		{
			getBrickCommand: $author$project$Main$CommandPenUp,
			getBrickType: $author$project$Main$BasicBrick,
			getText: $author$project$Main$Pen($author$project$Main$Up)
		}),
		_Utils_Tuple2(
		_Utils_Tuple2(20, 1000),
		{
			getBrickCommand: $author$project$Main$CommandNOP,
			getBrickType: $author$project$Main$EntryBrick,
			getText: $author$project$Main$Name('usagi')
		}),
		_Utils_Tuple2(
		_Utils_Tuple2(170, 1000),
		{
			getBrickCommand: $author$project$Main$CommandNOP,
			getBrickType: $author$project$Main$CallBrick,
			getText: $author$project$Main$Name('usagi')
		}),
		_Utils_Tuple2(
		_Utils_Tuple2(20, 1150),
		{
			getBrickCommand: $author$project$Main$CommandNOP,
			getBrickType: $author$project$Main$EntryBrick,
			getText: $author$project$Main$Name('kuma')
		}),
		_Utils_Tuple2(
		_Utils_Tuple2(170, 1150),
		{
			getBrickCommand: $author$project$Main$CommandNOP,
			getBrickType: $author$project$Main$CallBrick,
			getText: $author$project$Main$Name('kuma')
		}),
		_Utils_Tuple2(
		_Utils_Tuple2(20, 1300),
		{
			getBrickCommand: $author$project$Main$CommandNOP,
			getBrickType: $author$project$Main$SpacerBrick,
			getText: $author$project$Main$Space('right')
		}),
		_Utils_Tuple2(
		_Utils_Tuple2(170, 1300),
		{
			getBrickCommand: $author$project$Main$CommandNOP,
			getBrickType: $author$project$Main$SpacerBrick,
			getText: $author$project$Main$Space('down')
		})
	]);
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $author$project$Main$preventDefaultOn = function (eventName) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$json$Json$Decode$map(
			function (m) {
				return {message: m, preventDefault: true, stopPropagation: true};
			}),
		$elm$html$Html$Events$custom(eventName));
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Main$MsgAttachMe = function (a) {
	return {$: 'MsgAttachMe', a: a};
};
var $author$project$Main$MsgCloneUs = function (a) {
	return {$: 'MsgCloneUs', a: a};
};
var $author$project$Main$MsgDblClick = {$: 'MsgDblClick'};
var $author$project$Main$MsgStartDnD = F2(
	function (a, b) {
		return {$: 'MsgStartDnD', a: a, b: b};
	});
var $author$project$Main$NoAction = {$: 'NoAction'};
var $author$project$Main$ToBottom = {$: 'ToBottom'};
var $author$project$Main$ToRight = {$: 'ToRight'};
var $elm$virtual_dom$VirtualDom$lazy3 = _VirtualDom_lazy3;
var $elm$html$Html$Lazy$lazy3 = $elm$virtual_dom$VirtualDom$lazy3;
var $elm$virtual_dom$VirtualDom$lazy4 = _VirtualDom_lazy4;
var $elm$html$Html$Lazy$lazy4 = $elm$virtual_dom$VirtualDom$lazy4;
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Main$MsgLetMeRoot = F2(
	function (a, b) {
		return {$: 'MsgLetMeRoot', a: a, b: b};
	});
var $author$project$Main$MsgNOP = {$: 'MsgNOP'};
var $author$project$Main$MsgCheckString = F3(
	function (a, b, c) {
		return {$: 'MsgCheckString', a: a, b: b, c: c};
	});
var $author$project$Main$MsgInputChanged = F3(
	function (a, b, c) {
		return {$: 'MsgInputChanged', a: a, b: b, c: c};
	});
var $author$project$Main$MsgSetVarNames = {$: 'MsgSetVarNames'};
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$html$Html$datalist = _VirtualDom_node('datalist');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$html$Html$i = _VirtualDom_node('i');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$Attributes$list = _VirtualDom_attribute('list');
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $author$project$Main$viewDataList = function (str) {
	return A2(
		$elm$html$Html$option,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$value(str)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(str)
			]));
};
var $author$project$Main$viewDropDown = F2(
	function (select, str) {
		return A2(
			$elm$html$Html$option,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$value(str),
					$elm$html$Html$Attributes$selected(
					_Utils_eq(str, select))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(str)
				]));
	});
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $author$project$Main$viewBrick = F3(
	function (model, xy, node) {
		var viewBrickPath = function () {
			var _v9 = node.getBrickType;
			switch (_v9.$) {
				case 'EntryBrick':
					return 'M 320.0663 400 C 320.53105 393.00195 323.4379 386.13573 328.78682 380.7868 C 340.50254 369.07104 359.49746 369.07104 371.2132 380.7868 C 376.5621 386.13573 379.46895 393.00195 379.9337 400 L 490 400 C 495.52285 400 500 395.52285 500 390 L 500 279.9337 C 491.6702 280.48686 483.15363 277.58003 476.7868 271.21318 C 465.07104 259.49746 465.07104 240.50254 476.7868 228.78682 C 483.15363 222.41997 491.6702 219.51314 500 220.06632 L 500 110 C 500 104.47715 495.52285 100 490 100 L 210 100 C 204.47715 100 200 104.47715 200 110 L 200 390 C 200 395.52285 204.47715 400 210 400 Z';
				case 'SpacerBrick':
					var _v10 = node.getText;
					if ((_v10.$ === 'Space') && (_v10.a === 'right')) {
						return 'M 500 220.0663 L 500 110 C 500 104.4771 495.5229 100 490 100 L 379.9337 100 L 320.0663 100 L 210 100 C 204.4771 100 200 104.4771 200 110 L 200 220.0663 C 191.6702 219.5131 183.1536 222.42 176.7868 228.7868 C 165.071 240.5025 165.071 259.4975 176.7868 271.2132 C 183.1536 277.58 191.6702 280.4869 200 279.9337 L 200 390 C 200 395.5229 204.4771 400 210 400 L 320.0663 400 L 490 400 C 495.5229 400 500 395.5229 500 390 L 500 279.9337 C 491.6702 280.4869 483.1536 277.58 476.7868 271.2132 C 465.071 259.4975 465.071 240.5025 476.7868 228.7868 C 483.1536 222.42 491.6702 219.5131 500 220.0663 Z';
					} else {
						return 'M 500 220.0663 L 500 110 C 500 104.4771 495.5229 100 490 100 L 379.9337 100 C 379.469 93.0019 376.5621 86.1357 371.2132 80.7868 C 359.4975 69.071 340.5025 69.071 328.7868 80.7868 C 323.4379 86.1357 320.531 93.0019 320.0663 100 L 320.0663 100 L 210 100 C 204.4771 100 200 104.4771 200 110 L 200 220.0663 L 200 390 C 200 395.5229 204.4771 400 210 400 L 320.0663 400 C 320.531 393.002 323.4379 386.1357 328.7868 380.7868 C 340.5025 369.071 359.4975 369.071 371.2132 380.7868 C 376.5621 386.1357 379.469 393.002 379.9337 400 L 490 400 C 495.5229 400 500 395.5229 500 390 L 500 279.9337 Z';
					}
				default:
					return 'M 500 220.06632 L 500 110 C 500 104.47715 495.52285 100 490 100 L 379.9337 100 C 379.46895 93.00195 376.5621 86.13573 371.2132 80.78682 C 359.49746 69.07104 340.50254 69.07104 328.78682 80.78682 C 323.4379 86.13573 320.53105 93.00195 320.0663 100 L 320.0663 100 L 210 100 C 204.47715 100 200 104.47715 200 110 L 200 220.06632 C 191.6702 219.51314 183.15363 222.41997 176.78682 228.78682 C 165.07104 240.50254 165.07104 259.49746 176.78682 271.21318 C 183.15363 277.58003 191.6702 280.48686 200 279.9337 L 200 390 C 200 395.52285 204.47715 400 210 400 L 320.0663 400 C 320.53105 393.00195 323.4379 386.13573 328.78682 380.7868 C 340.50254 369.07104 359.49746 369.07104 371.2132 380.7868 C 376.5621 386.13573 379.46895 393.00195 379.9337 400 L 490 400 C 495.52285 400 500 395.52285 500 390 L 500 279.9337 C 491.6702 280.48686 483.15363 277.58003 476.7868 271.21318 C 465.07104 259.49746 465.07104 240.50254 476.7868 228.78682 C 483.15363 222.41997 491.6702 219.51314 500 220.06632 Z';
			}
		}();
		var image = 'dist/assets/' + function () {
			var _v8 = node.getBrickType;
			switch (_v8.$) {
				case 'BasicBrick':
					return _Utils_eq(node.getBrickCommand, $author$project$Main$CommandToioMoveForward) ? 'toio_forward.png' : 'toio_turn_left.png';
				case 'EntryBrick':
					return _Utils_eq(
						node.getText,
						$author$project$Main$Name('usagi')) ? 'begin_usagi.png' : 'begin_kuma.png';
				case 'CallBrick':
					return _Utils_eq(
						node.getText,
						$author$project$Main$Name('usagi')) ? 'end_usagi.png' : 'end_kuma.png';
				case 'CaseBrick':
					return 'snoopy.png';
				default:
					return '';
			}
		}();
		var color = function () {
			var _v7 = node.getBrickType;
			switch (_v7.$) {
				case 'BasicBrick':
					return 'yellow';
				case 'EntryBrick':
					return 'pink';
				case 'CallBrick':
					return 'skyblue';
				case 'CaseBrick':
					return 'limegreen';
				default:
					return 'white';
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$svg,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(model.getBrickSize)),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromFloat(model.getBrickSize)),
							$elm$svg$Svg$Attributes$viewBox('166 70 336 336')
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d(viewBrickPath),
									$elm$svg$Svg$Attributes$stroke('gray'),
									$elm$svg$Svg$Attributes$fill(color),
									$elm$svg$Svg$Attributes$strokeWidth('6')
								]),
							_List_Nil)
						])),
					((_Utils_eq(node.getBrickType, $author$project$Main$EntryBrick) || _Utils_eq(node.getBrickType, $author$project$Main$CallBrick)) && (_Utils_eq(
					node.getText,
					$author$project$Main$Name('usagi')) || _Utils_eq(
					node.getText,
					$author$project$Main$Name('kuma')))) ? A2(
					$elm$html$Html$img,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$src(image),
							$elm$svg$Svg$Attributes$width('100'),
							$elm$svg$Svg$Attributes$height('100'),
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'pointer-events', 'none'),
							A2($elm$html$Html$Attributes$style, 'margin', '15px 15px'),
							$elm$html$Html$Attributes$class('image is-overray'),
							A2($elm$html$Html$Attributes$style, 'top', '0%'),
							A2($elm$html$Html$Attributes$style, 'left', '0%')
						]),
					_List_Nil) : A2($elm$html$Html$div, _List_Nil, _List_Nil),
					A2(
					$elm$html$Html$i,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'pointer-events', 'none'),
							A2($elm$html$Html$Attributes$style, 'top', '20%'),
							A2($elm$html$Html$Attributes$style, 'left', '20%'),
							A2($elm$html$Html$Attributes$style, 'color', 'gray'),
							$elm$html$Html$Attributes$class(
							function () {
								var _v0 = node.getBrickType;
								switch (_v0.$) {
									case 'CaseBrick':
										return 'fas fa-question fa-3x';
									case 'BasicBrick':
										var _v1 = node.getBrickCommand;
										switch (_v1.$) {
											case 'CommandToioMoveForward':
												return 'fas fa-long-arrow-alt-right fa-4x';
											case 'CommandToioMoveBackward':
												return 'fas fa-long-arrow-alt-left fa-4x';
											case 'CommandToioTurnLeft':
												return 'fas fa-undo-alt fa-3x faa-spin animated';
											case 'CommandToioTurnRight':
												return 'fas fa-redo-alt fa-3x faa-spin animated';
											case 'CommandToioPlayPresetSound':
												return 'fas fa-volume-up fa-5x';
											case 'CommandPush':
												return 'fas fa-sign-in-alt fa-3x fa-rotate-90';
											case 'CommandPop':
												return 'fas fa-sign-out-alt fa-3x fa-rotate-270';
											case 'CommandPenDown':
												return 'fas fa-pencil-alt fa-3x';
											case 'CommandPenUp':
												return 'fas fa-pencil-alt fa-3x';
											default:
												return '';
										}
									case 'SpacerBrick':
										return _Utils_eq(
											node.getText,
											$author$project$Main$Space('right')) ? 'far fa-hand-point-right fa-5x' : 'far fa-hand-point-down fa-5x';
									default:
										return '';
								}
							}())
						]),
					_List_Nil),
					function () {
					var _v2 = node.getText;
					if (_v2.$ === 'Pen') {
						var penState = _v2.a;
						return A2(
							$elm$html$Html$i,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
									A2($elm$html$Html$Attributes$style, 'pointer-events', 'none'),
									A2($elm$html$Html$Attributes$style, 'top', '45%'),
									A2($elm$html$Html$Attributes$style, 'left', '45%'),
									A2($elm$html$Html$Attributes$style, 'color', 'gray'),
									$elm$html$Html$Attributes$class(
									function () {
										if (penState.$ === 'Down') {
											return 'fas fa-arrow-down fa-3x';
										} else {
											return 'fas fa-arrow-up   fa-3x';
										}
									}())
								]),
							_List_Nil);
					} else {
						return A2($elm$html$Html$i, _List_Nil, _List_Nil);
					}
				}(),
					function () {
					var _v4 = node.getText;
					switch (_v4.$) {
						case 'Name':
							var str = _v4.a;
							var _v5 = node.getBrickType;
							switch (_v5.$) {
								case 'EntryBrick':
									return A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
												A2($elm$html$Html$Attributes$style, 'top', '10%'),
												A2($elm$html$Html$Attributes$style, 'left', '20%')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(str)
											]));
								case 'CallBrick':
									return A2(
										$elm$html$Html$select,
										_List_fromArray(
											[
												A2(
												$author$project$Main$on,
												'change',
												A2(
													$elm$json$Json$Decode$map,
													A2($author$project$Main$MsgInputChanged, xy, 1),
													$elm$html$Html$Events$targetValue)),
												A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
												A2($elm$html$Html$Attributes$style, 'top', '10%'),
												A2($elm$html$Html$Attributes$style, 'left', '20%'),
												A2($elm$html$Html$Attributes$style, 'width', '60px')
											]),
										A2(
											$elm$core$List$map,
											$author$project$Main$viewDropDown(str),
											$elm$core$Set$toList(model.routineNames)));
								default:
									return A2($elm$html$Html$div, _List_Nil, _List_Nil);
							}
						case 'Param':
							var val = _v4.a;
							return _Utils_eq(node.getBrickCommand, $author$project$Main$CommandToioPlayPresetSound) ? A2($elm$html$Html$div, _List_Nil, _List_Nil) : A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
												A2($elm$html$Html$Attributes$style, 'top', '65%'),
												A2($elm$html$Html$Attributes$style, 'left', '20%'),
												A2($elm$html$Html$Attributes$style, 'width', '60px'),
												$elm$html$Html$Attributes$value(val),
												$elm$html$Html$Attributes$hidden(false),
												A2(
												$author$project$Main$on,
												'input',
												A2(
													$elm$json$Json$Decode$map,
													A2($author$project$Main$MsgInputChanged, xy, 1),
													$elm$html$Html$Events$targetValue)),
												A2(
												$author$project$Main$on,
												'focus',
												$elm$json$Json$Decode$succeed($author$project$Main$MsgSetVarNames)),
												$elm$html$Html$Attributes$list('Param')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$datalist,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id('Param')
											]),
										A2(
											$elm$core$List$map,
											$author$project$Main$viewDataList,
											$elm$core$Set$toList(model.varNames))),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
												A2($elm$html$Html$Attributes$style, 'top', '63%'),
												A2($elm$html$Html$Attributes$style, 'left', '70%')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												function () {
													var _v6 = node.getBrickCommand;
													switch (_v6.$) {
														case 'CommandToioMoveForward':
															return 'px';
														case 'CommandToioMoveBackward':
															return 'px';
														case 'CommandToioTurnLeft':
															return '度';
														case 'CommandToioTurnRight':
															return '度';
														default:
															return '';
													}
												}())
											]))
									]));
						case 'Init':
							var _var = _v4.a;
							var val = _v4.b;
							return A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
												A2($elm$html$Html$Attributes$style, 'top', '65%'),
												A2($elm$html$Html$Attributes$style, 'left', '15%'),
												A2($elm$html$Html$Attributes$style, 'width', '30px'),
												$elm$html$Html$Attributes$value(_var),
												$elm$html$Html$Attributes$hidden(false),
												A2(
												$author$project$Main$on,
												'input',
												A2(
													$elm$json$Json$Decode$map,
													A2($author$project$Main$MsgInputChanged, xy, 1),
													$elm$html$Html$Events$targetValue))
											]),
										_List_Nil),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
												A2($elm$html$Html$Attributes$style, 'top', '65%'),
												A2($elm$html$Html$Attributes$style, 'left', '40%')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('=')
											])),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
												A2($elm$html$Html$Attributes$style, 'top', '65%'),
												A2($elm$html$Html$Attributes$style, 'left', '50%'),
												A2($elm$html$Html$Attributes$style, 'width', '55px'),
												$elm$html$Html$Attributes$value(val),
												$elm$html$Html$Attributes$hidden(false),
												A2(
												$author$project$Main$on,
												'input',
												A2(
													$elm$json$Json$Decode$map,
													A2($author$project$Main$MsgInputChanged, xy, 2),
													$elm$html$Html$Events$targetValue)),
												A2(
												$author$project$Main$on,
												'blur',
												A2(
													$elm$json$Json$Decode$map,
													A2($author$project$Main$MsgCheckString, xy, 2),
													$elm$html$Html$Events$targetValue)),
												A2(
												$author$project$Main$on,
												'focus',
												$elm$json$Json$Decode$succeed($author$project$Main$MsgSetVarNames)),
												$elm$html$Html$Attributes$list('Init')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$datalist,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id('Init')
											]),
										A2(
											$elm$core$List$map,
											$author$project$Main$viewDataList,
											$elm$core$Set$toList(model.varNames)))
									]));
						case 'Calc':
							var _var = _v4.a;
							var val1 = _v4.b;
							var op = _v4.c;
							var val2 = _v4.d;
							return A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
												A2($elm$html$Html$Attributes$style, 'top', '35%'),
												A2($elm$html$Html$Attributes$style, 'left', '20%'),
												A2($elm$html$Html$Attributes$style, 'width', '45px'),
												$elm$html$Html$Attributes$value(_var),
												$elm$html$Html$Attributes$hidden(false),
												A2(
												$author$project$Main$on,
												'input',
												A2(
													$elm$json$Json$Decode$map,
													A2($author$project$Main$MsgInputChanged, xy, 1),
													$elm$html$Html$Events$targetValue))
											]),
										_List_Nil),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
												A2($elm$html$Html$Attributes$style, 'top', '35%'),
												A2($elm$html$Html$Attributes$style, 'left', '60%')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('=')
											])),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
												A2($elm$html$Html$Attributes$style, 'top', '65%'),
												A2($elm$html$Html$Attributes$style, 'left', '13%'),
												A2($elm$html$Html$Attributes$style, 'width', '37px'),
												$elm$html$Html$Attributes$value(val1),
												$elm$html$Html$Attributes$hidden(false),
												A2(
												$author$project$Main$on,
												'input',
												A2(
													$elm$json$Json$Decode$map,
													A2($author$project$Main$MsgInputChanged, xy, 2),
													$elm$html$Html$Events$targetValue)),
												A2(
												$author$project$Main$on,
												'focus',
												$elm$json$Json$Decode$succeed($author$project$Main$MsgSetVarNames)),
												$elm$html$Html$Attributes$list('Calc2')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$datalist,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id('Calc2')
											]),
										A2(
											$elm$core$List$map,
											$author$project$Main$viewDataList,
											$elm$core$Set$toList(model.varNames))),
										A2(
										$elm$html$Html$select,
										_List_fromArray(
											[
												A2(
												$author$project$Main$on,
												'change',
												A2(
													$elm$json$Json$Decode$map,
													A2($author$project$Main$MsgInputChanged, xy, 3),
													$elm$html$Html$Events$targetValue)),
												A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
												A2($elm$html$Html$Attributes$style, 'top', '65%'),
												A2($elm$html$Html$Attributes$style, 'left', '43%'),
												A2($elm$html$Html$Attributes$style, 'width', '33px')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('Add'),
														$elm$html$Html$Attributes$selected(
														_Utils_eq(op, $author$project$Main$Add))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('+')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('Sub'),
														$elm$html$Html$Attributes$selected(
														_Utils_eq(op, $author$project$Main$Sub))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('-')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('Mul'),
														$elm$html$Html$Attributes$selected(
														_Utils_eq(op, $author$project$Main$Mul))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('*')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('Div'),
														$elm$html$Html$Attributes$selected(
														_Utils_eq(op, $author$project$Main$Div))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('/')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('Quotient'),
														$elm$html$Html$Attributes$selected(
														_Utils_eq(op, $author$project$Main$Quotient))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('//')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('Mod'),
														$elm$html$Html$Attributes$selected(
														_Utils_eq(op, $author$project$Main$Mod))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('%')
													]))
											])),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
												A2($elm$html$Html$Attributes$style, 'top', '65%'),
												A2($elm$html$Html$Attributes$style, 'left', '70%'),
												A2($elm$html$Html$Attributes$style, 'width', '35px'),
												$elm$html$Html$Attributes$value(val2),
												$elm$html$Html$Attributes$hidden(false),
												A2(
												$author$project$Main$on,
												'input',
												A2(
													$elm$json$Json$Decode$map,
													A2($author$project$Main$MsgInputChanged, xy, 4),
													$elm$html$Html$Events$targetValue)),
												A2(
												$author$project$Main$on,
												'focus',
												$elm$json$Json$Decode$succeed($author$project$Main$MsgSetVarNames)),
												$elm$html$Html$Attributes$list('Calc4')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$datalist,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id('Calc4')
											]),
										A2(
											$elm$core$List$map,
											$author$project$Main$viewDataList,
											$elm$core$Set$toList(model.varNames)))
									]));
						case 'Cond':
							var val1 = _v4.a;
							var cp = _v4.b;
							var val2 = _v4.c;
							return A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
												A2($elm$html$Html$Attributes$style, 'top', '65%'),
												A2($elm$html$Html$Attributes$style, 'left', '13%'),
												A2($elm$html$Html$Attributes$style, 'width', '34px'),
												$elm$html$Html$Attributes$value(val1),
												$elm$html$Html$Attributes$hidden(false),
												A2(
												$author$project$Main$on,
												'input',
												A2(
													$elm$json$Json$Decode$map,
													A2($author$project$Main$MsgInputChanged, xy, 1),
													$elm$html$Html$Events$targetValue)),
												A2(
												$author$project$Main$on,
												'blur',
												A2(
													$elm$json$Json$Decode$map,
													A2($author$project$Main$MsgCheckString, xy, 1),
													$elm$html$Html$Events$targetValue)),
												A2(
												$author$project$Main$on,
												'focus',
												$elm$json$Json$Decode$succeed($author$project$Main$MsgSetVarNames)),
												$elm$html$Html$Attributes$list('Cond1')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$datalist,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id('Cond1')
											]),
										A2(
											$elm$core$List$map,
											$author$project$Main$viewDataList,
											$elm$core$Set$toList(model.varNames))),
										A2(
										$elm$html$Html$select,
										_List_fromArray(
											[
												A2(
												$author$project$Main$on,
												'change',
												A2(
													$elm$json$Json$Decode$map,
													A2($author$project$Main$MsgInputChanged, xy, 2),
													$elm$html$Html$Events$targetValue)),
												A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
												A2($elm$html$Html$Attributes$style, 'top', '65%'),
												A2($elm$html$Html$Attributes$style, 'left', '40%'),
												A2($elm$html$Html$Attributes$style, 'width', '40px')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('Eq'),
														$elm$html$Html$Attributes$selected(
														_Utils_eq(cp, $author$project$Main$Eq))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('==')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('Ne'),
														$elm$html$Html$Attributes$selected(
														_Utils_eq(cp, $author$project$Main$Ne))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('!=')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('Gt'),
														$elm$html$Html$Attributes$selected(
														_Utils_eq(cp, $author$project$Main$Gt))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('>')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('Lt'),
														$elm$html$Html$Attributes$selected(
														_Utils_eq(cp, $author$project$Main$Lt))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('<')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('Ge'),
														$elm$html$Html$Attributes$selected(
														_Utils_eq(cp, $author$project$Main$Ge))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('>=')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('Le'),
														$elm$html$Html$Attributes$selected(
														_Utils_eq(cp, $author$project$Main$Le))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('<=')
													]))
											])),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
												A2($elm$html$Html$Attributes$style, 'top', '65%'),
												A2($elm$html$Html$Attributes$style, 'left', '72%'),
												A2($elm$html$Html$Attributes$style, 'width', '32px'),
												$elm$html$Html$Attributes$value(val2),
												$elm$html$Html$Attributes$hidden(false),
												A2(
												$author$project$Main$on,
												'input',
												A2(
													$elm$json$Json$Decode$map,
													A2($author$project$Main$MsgInputChanged, xy, 3),
													$elm$html$Html$Events$targetValue)),
												A2(
												$author$project$Main$on,
												'blur',
												A2(
													$elm$json$Json$Decode$map,
													A2($author$project$Main$MsgCheckString, xy, 3),
													$elm$html$Html$Events$targetValue)),
												A2(
												$author$project$Main$on,
												'focus',
												$elm$json$Json$Decode$succeed($author$project$Main$MsgSetVarNames)),
												$elm$html$Html$Attributes$list('Cond3')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$datalist,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id('Cond3')
											]),
										A2(
											$elm$core$List$map,
											$author$project$Main$viewDataList,
											$elm$core$Set$toList(model.varNames)))
									]));
						case 'Push':
							var val = _v4.a;
							return A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
												A2($elm$html$Html$Attributes$style, 'top', '65%'),
												A2($elm$html$Html$Attributes$style, 'left', '20%'),
												A2($elm$html$Html$Attributes$style, 'width', '87px'),
												$elm$html$Html$Attributes$value(val),
												$elm$html$Html$Attributes$hidden(false),
												A2(
												$author$project$Main$on,
												'input',
												A2(
													$elm$json$Json$Decode$map,
													A2($author$project$Main$MsgInputChanged, xy, 1),
													$elm$html$Html$Events$targetValue)),
												A2(
												$author$project$Main$on,
												'blur',
												A2(
													$elm$json$Json$Decode$map,
													A2($author$project$Main$MsgCheckString, xy, 1),
													$elm$html$Html$Events$targetValue)),
												A2(
												$author$project$Main$on,
												'focus',
												$elm$json$Json$Decode$succeed($author$project$Main$MsgSetVarNames)),
												$elm$html$Html$Attributes$list('Push')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$datalist,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id('Push')
											]),
										A2(
											$elm$core$List$map,
											$author$project$Main$viewDataList,
											$elm$core$Set$toList(model.varNames)))
									]));
						case 'Pop':
							var _var = _v4.a;
							return A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
												A2($elm$html$Html$Attributes$style, 'top', '65%'),
												A2($elm$html$Html$Attributes$style, 'left', '20%'),
												A2($elm$html$Html$Attributes$style, 'width', '87px'),
												$elm$html$Html$Attributes$value(_var),
												$elm$html$Html$Attributes$hidden(false),
												A2(
												$author$project$Main$on,
												'input',
												A2(
													$elm$json$Json$Decode$map,
													A2($author$project$Main$MsgInputChanged, xy, 1),
													$elm$html$Html$Events$targetValue))
											]),
										_List_Nil)
									]));
						default:
							return A2($elm$html$Html$div, _List_Nil, _List_Nil);
					}
				}()
				]));
	});
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm_community$json_extra$Json$Decode$Extra$when = F3(
	function (checkDecoder, check, passDecoder) {
		return A2(
			$elm$json$Json$Decode$andThen,
			function (checkVal) {
				return check(checkVal) ? passDecoder : $elm$json$Json$Decode$fail('Check failed with input');
			},
			checkDecoder);
	});
var $author$project$Main$whenLeftButtonIsDown = function (decoder) {
	return A3(
		$elm_community$json_extra$Json$Decode$Extra$when,
		A2($elm$json$Json$Decode$field, 'button', $elm$json$Json$Decode$int),
		function (button) {
			return !button;
		},
		decoder);
};
var $author$project$Main$whenNotDragging = F2(
	function (model, decoder) {
		return A3(
			$elm_community$json_extra$Json$Decode$Extra$when,
			$elm$json$Json$Decode$succeed(0),
			function (_v0) {
				return !model.getDnDInfo.getOnDnD;
			},
			decoder);
	});
var $author$project$Main$whenRightButtonIsDown = function (decoder) {
	return A3(
		$elm_community$json_extra$Json$Decode$Extra$when,
		A2($elm$json$Json$Decode$field, 'button', $elm$json$Json$Decode$int),
		function (button) {
			return button === 2;
		},
		decoder);
};
var $author$project$Main$viewAST = F4(
	function (model, _v0, direction, ast) {
		var x = _v0.a;
		var y = _v0.b;
		if (ast.$ === 'Nil') {
			return A2($elm$html$Html$div, _List_Nil, _List_Nil);
		} else {
			var n = ast.a;
			var b = ast.b;
			var r = ast.c;
			return A3(
				$elm$html$Html$Keyed$node,
				'div',
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2(
						$elm$html$Html$Attributes$style,
						'top',
						function () {
							if (direction.$ === 'ToRight') {
								return '0px';
							} else {
								return $elm$core$String$fromFloat(
									$author$project$Main$interval(model)) + 'px';
							}
						}()),
						A2(
						$elm$html$Html$Attributes$style,
						'left',
						function () {
							if (direction.$ === 'ToBottom') {
								return '0px';
							} else {
								return $elm$core$String$fromFloat(
									$author$project$Main$interval(model)) + 'px';
							}
						}()),
						A2(
						$author$project$Main$on,
						'mousedown',
						A2(
							$author$project$Main$whenNotDragging,
							model,
							$author$project$Main$whenLeftButtonIsDown(
								A5(
									$elm$json$Json$Decode$map4,
									F4(
										function (pageX, pageY, offsetX, offsetY) {
											var boundingY = pageY - offsetY;
											var boundingX = pageX - offsetX;
											return A2(
												$author$project$Main$insideBrick,
												_Utils_Tuple2(x, y),
												_Utils_Tuple2(boundingX, boundingY)) ? A2(
												$author$project$Main$MsgLetMeRoot,
												A2(
													$author$project$Main$ASTxy,
													_Utils_Tuple2(x, y),
													A3($author$project$Main$ASTne, n, b, r)),
												_Utils_Tuple2(pageX, pageY)) : $author$project$Main$MsgNOP;
										}),
									A2($elm$json$Json$Decode$field, 'pageX', $elm$json$Json$Decode$float),
									A2($elm$json$Json$Decode$field, 'pageY', $elm$json$Json$Decode$float),
									A2($elm$json$Json$Decode$field, 'offsetX', $elm$json$Json$Decode$float),
									A2($elm$json$Json$Decode$field, 'offsetY', $elm$json$Json$Decode$float))))),
						A2(
						$author$project$Main$preventDefaultOn,
						'contextmenu',
						A2(
							$author$project$Main$whenNotDragging,
							model,
							$author$project$Main$whenRightButtonIsDown(
								$elm$json$Json$Decode$succeed(
									$author$project$Main$MsgCloneUs(
										A2(
											$author$project$Main$ASTxy,
											_Utils_Tuple2(x, y),
											A3($author$project$Main$ASTne, n, b, r)))))))
					]),
				_List_fromArray(
					[
						_Utils_Tuple2(
						'N',
						A4(
							$elm$html$Html$Lazy$lazy3,
							$author$project$Main$viewBrick,
							model,
							_Utils_Tuple2(x, y),
							n)),
						_Utils_Tuple2(
						'R',
						A5(
							$elm$html$Html$Lazy$lazy4,
							$author$project$Main$viewAST,
							model,
							_Utils_Tuple2(
								x + $author$project$Main$interval(model),
								y),
							$author$project$Main$ToRight,
							r)),
						_Utils_Tuple2(
						'B',
						A5(
							$elm$html$Html$Lazy$lazy4,
							$author$project$Main$viewAST,
							model,
							_Utils_Tuple2(
								x,
								y + $author$project$Main$interval(model)),
							$author$project$Main$ToBottom,
							b))
					]));
		}
	});
var $author$project$Main$whenDragging = F2(
	function (model, decoder) {
		return A3(
			$elm_community$json_extra$Json$Decode$Extra$when,
			$elm$json$Json$Decode$succeed(0),
			function (_v0) {
				return model.getDnDInfo.getOnDnD;
			},
			decoder);
	});
var $author$project$Main$viewASTRoot = F2(
	function (model, root) {
		var _v0 = root.a;
		var x = _v0.a;
		var y = _v0.b;
		var _v1 = root.b;
		var n = _v1.a;
		var b = _v1.b;
		var r = _v1.c;
		return A3(
			$elm$html$Html$Keyed$node,
			'div',
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromFloat(y) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromFloat(x) + 'px'),
					A2(
					$author$project$Main$on,
					'mouseup',
					A2(
						$author$project$Main$whenDragging,
						model,
						$author$project$Main$whenLeftButtonIsDown(
							$elm$json$Json$Decode$succeed(
								$author$project$Main$MsgAttachMe(root))))),
					A2(
					$author$project$Main$preventDefaultOn,
					'touchend',
					A2(
						$author$project$Main$whenDragging,
						model,
						$elm$json$Json$Decode$succeed(
							$author$project$Main$MsgAttachMe(root)))),
					A2(
					$author$project$Main$on,
					'mousedown',
					A2(
						$author$project$Main$whenNotDragging,
						model,
						$author$project$Main$whenLeftButtonIsDown(
							A3(
								$elm$json$Json$Decode$map2,
								F2(
									function (pageX, pageY) {
										return A2(
											$author$project$Main$MsgStartDnD,
											_Utils_Tuple2(x, y),
											_Utils_Tuple2(pageX, pageY));
									}),
								A2($elm$json$Json$Decode$field, 'pageX', $elm$json$Json$Decode$float),
								A2($elm$json$Json$Decode$field, 'pageY', $elm$json$Json$Decode$float))))),
					A2(
					$author$project$Main$on,
					'touchstart',
					A2(
						$author$project$Main$whenNotDragging,
						model,
						A3(
							$elm$json$Json$Decode$map2,
							F2(
								function (clientX, clientY) {
									return A2(
										$author$project$Main$MsgStartDnD,
										_Utils_Tuple2(x, y),
										_Utils_Tuple2(clientX, clientY));
								}),
							A2(
								$elm$json$Json$Decode$at,
								_List_fromArray(
									['changedTouches', '0', 'clientX']),
								$elm$json$Json$Decode$float),
							A2(
								$elm$json$Json$Decode$at,
								_List_fromArray(
									['changedTouches', '0', 'clientY']),
								$elm$json$Json$Decode$float)))),
					A2(
					$author$project$Main$preventDefaultOn,
					'contextmenu',
					A2(
						$author$project$Main$whenNotDragging,
						model,
						$author$project$Main$whenRightButtonIsDown(
							$elm$json$Json$Decode$succeed(
								$author$project$Main$MsgCloneUs(
									A2(
										$author$project$Main$ASTxy,
										_Utils_Tuple2(x, y),
										A3($author$project$Main$ASTne, n, b, r))))))),
					A2(
					$author$project$Main$on,
					'dblclick',
					$author$project$Main$whenLeftButtonIsDown(
						$elm$json$Json$Decode$succeed($author$project$Main$MsgDblClick))),
					A2(
					$author$project$Main$preventDefaultOn,
					'Duplicate',
					A2(
						$author$project$Main$whenNotDragging,
						model,
						A2(
							$elm$json$Json$Decode$andThen,
							function (touches) {
								return ($elm$core$List$length(touches) === 2) ? $elm$json$Json$Decode$succeed(
									$author$project$Main$MsgCloneUs(
										A2(
											$author$project$Main$ASTxy,
											_Utils_Tuple2(x, y),
											A3($author$project$Main$ASTne, n, b, r)))) : $elm$json$Json$Decode$succeed($author$project$Main$NoAction);
							},
							A2(
								$elm$json$Json$Decode$field,
								'changedTouches',
								$elm$json$Json$Decode$list($elm$json$Json$Decode$value)))))
				]),
			_List_fromArray(
				[
					_Utils_Tuple2(
					'N',
					A4(
						$elm$html$Html$Lazy$lazy3,
						$author$project$Main$viewBrick,
						model,
						_Utils_Tuple2(x, y),
						n)),
					_Utils_Tuple2(
					'R',
					A5(
						$elm$html$Html$Lazy$lazy4,
						$author$project$Main$viewAST,
						model,
						_Utils_Tuple2(
							x + $author$project$Main$interval(model),
							y),
						$author$project$Main$ToRight,
						r)),
					_Utils_Tuple2(
					'B',
					A5(
						$elm$html$Html$Lazy$lazy4,
						$author$project$Main$viewAST,
						model,
						_Utils_Tuple2(
							x,
							y + $author$project$Main$interval(model)),
						$author$project$Main$ToBottom,
						b))
				]));
	});
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $author$project$Main$viewTurtle = function (turtle) {
	var w = turtle.w;
	var triangle = _List_fromArray(
		[
			$elm$svg$Svg$Attributes$d(
			'M ' + ($elm$core$String$fromFloat((turtle.x + w) - (w / 8)) + (' ' + ($elm$core$String$fromFloat(turtle.y + (w / 2)) + (' L ' + ($elm$core$String$fromFloat((turtle.x + (w / 2)) + (w / 8)) + (' ' + ($elm$core$String$fromFloat((turtle.y + (w / 2)) + (w / 4)) + (' L ' + ($elm$core$String$fromFloat((turtle.x + (w / 2)) + (w / 8)) + (' ' + ($elm$core$String$fromFloat((turtle.y + (w / 2)) - (w / 4)) + ' Z')))))))))))),
			$elm$svg$Svg$Attributes$stroke('black'),
			$elm$svg$Svg$Attributes$fill('gray')
		]);
	var rotation = 'rotate(' + ($elm$core$String$fromFloat(turtle.heading) + (', ' + ($elm$core$String$fromFloat(turtle.x + (w / 2)) + (', ' + ($elm$core$String$fromFloat(turtle.y + (w / 2)) + ')')))));
	var lines = _List_fromArray(
		[
			$elm$svg$Svg$Attributes$d(
			A2($elm$core$String$join, ' ', turtle.lines)),
			$elm$svg$Svg$Attributes$stroke('red')
		]);
	var body = _List_fromArray(
		[
			$elm$svg$Svg$Attributes$x(
			$elm$core$String$fromFloat(turtle.x)),
			$elm$svg$Svg$Attributes$y(
			$elm$core$String$fromFloat(turtle.y)),
			$elm$svg$Svg$Attributes$width(
			$elm$core$String$fromFloat(w)),
			$elm$svg$Svg$Attributes$height(
			$elm$core$String$fromFloat(w)),
			$elm$svg$Svg$Attributes$stroke('black'),
			$elm$svg$Svg$Attributes$fill('lightgray')
		]);
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$svg,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$width('350'),
						$elm$svg$Svg$Attributes$height('350'),
						A2($elm$html$Html$Attributes$style, 'background-color', 'white')
					]),
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$g,
						_List_Nil,
						_List_fromArray(
							[
								A2($elm$svg$Svg$path, lines, _List_Nil)
							])),
						A2(
						$elm$svg$Svg$g,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$transform(rotation)
							]),
						_List_fromArray(
							[
								A2($elm$svg$Svg$rect, body, _List_Nil),
								A2($elm$svg$Svg$path, triangle, _List_Nil)
							]))
					]))
			]));
};
var $author$project$Main$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('columns'),
				A2(
				$author$project$Main$preventDefaultOn,
				'mousemove',
				A2(
					$author$project$Main$whenDragging,
					model,
					A3(
						$elm$json$Json$Decode$map2,
						F2(
							function (pageX, pageY) {
								return $author$project$Main$MsgMoveUs(
									_Utils_Tuple2(pageX, pageY));
							}),
						A2($elm$json$Json$Decode$field, 'pageX', $elm$json$Json$Decode$float),
						A2($elm$json$Json$Decode$field, 'pageY', $elm$json$Json$Decode$float)))),
				A2(
				$author$project$Main$preventDefaultOn,
				'touchmove',
				A2(
					$author$project$Main$whenDragging,
					model,
					A3(
						$elm$json$Json$Decode$map2,
						F2(
							function (clientX, clientY) {
								return $author$project$Main$MsgMoveUs(
									_Utils_Tuple2(clientX, clientY));
							}),
						A2(
							$elm$json$Json$Decode$at,
							_List_fromArray(
								['changedTouches', '0', 'clientX']),
							$elm$json$Json$Decode$float),
						A2(
							$elm$json$Json$Decode$at,
							_List_fromArray(
								['changedTouches', '0', 'clientY']),
							$elm$json$Json$Decode$float))))
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('column is-one-quarter'),
						A2($elm$html$Html$Attributes$style, 'background-color', 'orange')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'height', '3000px')
							]),
						_List_Nil),
						A3(
						$elm$html$Html$Keyed$node,
						'div',
						_List_Nil,
						A2(
							$elm$core$List$indexedMap,
							F2(
								function (index, astxy) {
									return _Utils_Tuple2(
										$elm$core$String$fromInt(index),
										A2($author$project$Main$viewASTRoot, model, astxy));
								}),
							A2($elm$core$List$map, $author$project$Main$createNewRoot, $author$project$Main$pallet)))
					])),
				A3(
				$elm$html$Html$Keyed$node,
				'div',
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('column'),
						A2($elm$html$Html$Attributes$style, 'background-color', 'lightgray')
					]),
				A2(
					$elm$core$List$indexedMap,
					F2(
						function (index, astxy) {
							return _Utils_Tuple2(
								$elm$core$String$fromInt(index),
								A2($author$project$Main$viewASTRoot, model, astxy));
						}),
					model.getASTRoots)),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('column is-one-quarter'),
						A2($elm$html$Html$Attributes$style, 'background-color', 'skyblue')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'position', 'relative'),
								A2($elm$html$Html$Attributes$style, 'top', '10px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												A2(
												$author$project$Main$on,
												'click',
												$elm$json$Json$Decode$succeed($author$project$Main$MsgDownload))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('プログラムを保存')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												A2(
												$author$project$Main$on,
												'click',
												$elm$json$Json$Decode$succeed($author$project$Main$MsgRequested))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('プログラムを読み込み')
											]))
									])),
								$author$project$Main$viewTurtle(model.turtle),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'width', '150px'),
												$elm$html$Html$Attributes$placeholder('マーカス'),
												$elm$html$Html$Attributes$value(model.routineBox),
												$elm$html$Html$Attributes$hidden(false),
												A2(
												$author$project$Main$on,
												'input',
												A2($elm$json$Json$Decode$map, $author$project$Main$MsgRoutineBoxChanged, $elm$html$Html$Events$targetValue))
											]),
										_List_Nil),
										$elm$html$Html$text(model.routineBox),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												A2(
												$author$project$Main$on,
												'click',
												$elm$json$Json$Decode$succeed($author$project$Main$MsgMakeNewRoutine))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('つくる')
											])),
										$elm$html$Html$text(
										$elm$core$String$fromInt(
											$elm$core$List$length(model.turtle.callStack)))
									])),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('最初のx座標 : '),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'width', '50px'),
												$elm$html$Html$Attributes$value(model.initXBox),
												$elm$html$Html$Attributes$hidden(false),
												A2(
												$author$project$Main$on,
												'input',
												A2($elm$json$Json$Decode$map, $author$project$Main$MsgInitXChanged, $elm$html$Html$Events$targetValue)),
												A2(
												$author$project$Main$on,
												'blur',
												$elm$json$Json$Decode$succeed($author$project$Main$MsgInitXBlur))
											]),
										_List_Nil)
									])),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('さいしょのy座標 : '),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'width', '50px'),
												$elm$html$Html$Attributes$value(model.initYBox),
												$elm$html$Html$Attributes$hidden(false),
												A2(
												$author$project$Main$on,
												'input',
												A2($elm$json$Json$Decode$map, $author$project$Main$MsgInitYChanged, $elm$html$Html$Events$targetValue)),
												A2(
												$author$project$Main$on,
												'blur',
												$elm$json$Json$Decode$succeed($author$project$Main$MsgInitYBlur))
											]),
										_List_Nil)
									])),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('さいしょの向き \u00A0\u00A0: '),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'width', '50px'),
												$elm$html$Html$Attributes$value(model.initHeadingBox),
												$elm$html$Html$Attributes$hidden(false),
												A2(
												$author$project$Main$on,
												'input',
												A2($elm$json$Json$Decode$map, $author$project$Main$MsgInitHeadingChanged, $elm$html$Html$Events$targetValue)),
												A2(
												$author$project$Main$on,
												'blur',
												$elm$json$Json$Decode$succeed($author$project$Main$MsgInitHeadingBlur))
											]),
										_List_Nil)
									]))
							]))
					]))
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{init: $author$project$Main$init, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));