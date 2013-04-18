test("kismet.read_tokens", function() {

    //empty string
    (function() {
        var result = kismet.read_tokens("");
        equal(0, result.length);
    })();

    //parse word
    (function() {
        var result = kismet.read_tokens("ABC");
        deepEqual(result, [[kismet.TYPE_WORD,"ABC"]]);
    })();

    //parse string
    (function() {
        var result = kismet.read_tokens("\"ABC\"");
        deepEqual(result, [[kismet.TYPE_STR,"ABC"]]);
    })();

    //split by whitespace
    (function() {
        var result = kismet.read_tokens("ABC DEF");
        deepEqual(result, [
            [kismet.TYPE_WORD,"ABC"],
            [kismet.TYPE_WORD,"DEF"]
        ]);
    })();

    //parse regex
    (function() {
        var result = kismet.read_tokens("/abc/i");
        deepEqual(result, [[kismet.TYPE_RE,"abc","i"]]);
    })();

    //parse column
    (function() {
        var result = kismet.read_tokens("name:ABC");
        deepEqual(result, [
            [kismet.TYPE_WORD,"name"],
            [kismet.TYPE_COLON,":"],
            [kismet.TYPE_WORD,"ABC"]
        ]);
    })();

    //parse bracket
    (function() {
            var result = kismet.read_tokens("(ABC)");
        deepEqual(result, [
            [kismet.TYPE_LBRA,"("],
            [kismet.TYPE_WORD,"ABC"],
            [kismet.TYPE_RBRA,")"]
        ]);
    })();

    //ignore the other characters
    (function() {
        var result = kismet.read_tokens("ABC ,DEF");
        deepEqual(result, [
            [kismet.TYPE_WORD,"ABC"],
            [kismet.TYPE_WORD,"DEF"]
        ]);
    })();

});

test("kismet.eval_cond more than 2 conditions", function() {

    (function() {

        var temp = kismet.eval_bool_exp;
        kismet.eval_bool_exp = function(cond) {
            return (cond.constructor == Array);
        };

        ok(kismet.eval_cond([[4,"$NAME","ABC"],[11,"$TEXT","hoge"],[11,"$TEXT","fuga"]]));

        kismet.eval_bool_exp = temp;

    })();

    (function() {

        var temp = kismet.eval_bool_exp;
        kismet.eval_bool_exp = function(cond) {
            return (cond.constructor == Array)
                && (cond[2] == "ABC" || cond[2] == "hoge");
        };

        ok(!kismet.eval_cond([[4,"$NAME","ABC"],[11,"$TEXT","hoge"],[11,"$TEXT","fuga"]]));

        kismet.eval_bool_exp = temp;

    })();

});

test("kismet.compile column filter", function() {

    //parse 2 conditions
    (function() {
        var result = kismet.compile("name:ABC hoge");
        deepEqual(
            result,
            {name:"",cond:[[4,"$NAME","ABC"],[11,"$TEXT","hoge"]],action:[],column:[]}
        );
        deepEqual(kismet.rule_string, "Drop the tweet if it SENT BY @ABC and CONTAINS hoge");
    })();

    //parse 3 conditions
    (function() {
        var result = kismet.compile("name:ABC hoge fuga");
        deepEqual(
            result,
            {name:"",cond:[[4,"$NAME","ABC"],[11,"$TEXT","hoge"],[11,"$TEXT","fuga"]],action:[],column:[]}
        );
        deepEqual(kismet.rule_string, "Drop the tweet if it SENT BY @ABC and CONTAINS hoge and CONTAINS fuga");
    })();

});

test("kismet.compile column filter", function() {

    //parse column filter
    (function() {
        var result = kismet.compile("column:home");
        deepEqual(
            result,
            {name:"",cond:[],action:[],column:["home"]}
        );
        deepEqual(kismet.rule_string, "Drop the tweet if it ON COLUMN home");
    })();

    //parse column filter (multiple columns)
    (function() {
        var result = kismet.compile("column:home|mensions");
        deepEqual(
            result,
            {name:"",cond:[],action:[],column:["home","mensions"]}
        );
        deepEqual(kismet.rule_string, "Drop the tweet if it ON COLUMN home or mensions");
    })();

});
