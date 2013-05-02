describe("kismet.read_tokens", function() {

    it('empty string will be parsed as an empty array.', function() {
        var result = kismet.read_tokens("");
        expect(result.length).toBe(0);
    });

    it('simple string will be parsed as a word.', function() {
        var result = kismet.read_tokens("ABC");
        expect(result).toEqual([[kismet.TYPE_WORD,"ABC"]]);
    });

    it('a quoted string will be parsed as a string.', function() {
        var result = kismet.read_tokens("\"ABC\"");
        expect(result).toEqual([[kismet.TYPE_STR,"ABC"]]);
    });

    it('a given string will be split by white space.', function() {
        var result = kismet.read_tokens("ABC DEF");
        expect(result).toEqual([
            [kismet.TYPE_WORD,"ABC"],
            [kismet.TYPE_WORD,"DEF"]
        ]);
    });

    it('parse a regular expression.', function() {
        var result = kismet.read_tokens("/abc/i");
        expect(result).toEqual([[kismet.TYPE_RE,"abc","i"]]);
    });

    it('parse colon.', function() {
        var result = kismet.read_tokens("name:ABC");
        expect(result).toEqual([
            [kismet.TYPE_WORD,"name"],
            [kismet.TYPE_COLON,":"],
            [kismet.TYPE_WORD,"ABC"]
        ]);
    });

    it('parse bracket.', function() {
            var result = kismet.read_tokens("(ABC)");
        expect(result).toEqual([
            [kismet.TYPE_LBRA,"("],
            [kismet.TYPE_WORD,"ABC"],
            [kismet.TYPE_RBRA,")"]
        ]);
    });

    it('the other characters will be ignored.', function() {
        var result = kismet.read_tokens("ABC ,DEF");
        expect(result).toEqual([
            [kismet.TYPE_WORD,"ABC"],
            [kismet.TYPE_WORD,"DEF"]
        ]);
    });

});

describe("kismet.eval", function() {

    it('and operation between more than 2 conditions', function() {

        var temp = kismet.eval_bool_exp;
        kismet.eval_bool_exp = function(cond) {
            return (cond.constructor == Array);
        };

        expect(kismet.eval_cond([[4,"$NAME","ABC"],[11,"$TEXT","hoge"],[11,"$TEXT","fuga"]]))
        .toBe(true);

        kismet.eval_bool_exp = temp;

    });

});

describe("kismet.compile", function() {

    it('parse 2 conditions', function() {
        var result = kismet.compile("name:ABC hoge");
        expect(result)
        .toEqual(
            {name:"",cond:[[4,"$NAME","ABC"],[11,"$TEXT","hoge"]],action:[],column:[]}
        );
        expect(kismet.rule_string).toBe("Drop the tweet if it SENT BY @ABC and CONTAINS hoge");
    });

    it('parse 3 conditions', function() {
        var result = kismet.compile("name:ABC hoge fuga");
        expect(result)
        .toEqual(
            {name:"",cond:[[4,"$NAME","ABC"],[11,"$TEXT","hoge"],[11,"$TEXT","fuga"]],action:[],column:[]}
        );
        expect(kismet.rule_string).toBe("Drop the tweet if it SENT BY @ABC and CONTAINS hoge and CONTAINS fuga");
    });

});

describe("kismet.compile", function() {

    it('parse column filter', function() {
        var result = kismet.compile("column:home");
        expect(result)
        .toEqual(
            {name:"",cond:[],action:[],column:["home"]}
        );
        expect(kismet.rule_string).toBe("Drop the tweet if it ON COLUMN home");
    });

    it('parse column filter (multiple columns)', function() {
        var result = kismet.compile("column:home|mensions");
        expect(result)
        .toEqual(
            {name:"",cond:[],action:[],column:["home","mensions"]}
        );
        expect(kismet.rule_string).toBe("Drop the tweet if it ON COLUMN home or mensions");
    });

});
