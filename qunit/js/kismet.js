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

test("kismet.compile", function() {

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
