// const { Grammar } = require("./earley-oop");

// LekagulSensorData.csv
const pred_length = 2;
const expr_length = 2;

function updateAttr(){ 
    console.log(this.files[0]);
    var result;
    Papa.parse(this.files[0], {
        complete: function(results) {
            // console.log("Finished:", results.data);
            attr = results.data[0];
            $("#attr").append("attr -> ");
            for(var i in attr){
                if(i == attr.length-1){
                    $("#attr").append(attr[i]);
                }
                else{
                    $("#attr").append(attr[i] + " | ");
                }
            }
        }
    });
}

function is_hypo(tokenStream, grammar){
    // console.log(tokenStream);
    var result = true;
    if(tokenStream == null){
        result = false;
    }
    // console.log(grammar[tokenStream[0][0]]);
    for(var i in tokenStream){
        if(grammar[tokenStream[i]] != null){
            result = false;
        }
    }
    // console.log(result);

    return result;
}

function allstr_generatedby(grammar, worklist_0){
    // console.log(worklist_0);
    var result_list = [];
    var nonterminal_syms = [];
    result_list.push(worklist_0);

    if(is_hypo(worklist_0, grammar)){
        return worklist_0;
    }

    for (var i in worklist_0){
        if(grammar[worklist_0[i]] != null){
            nonterminal_syms.push(worklist_0[i]);
        }
    }

    while(nonterminal_syms.length != 0){
        for (var i in result_list){
            var index = result_list[i].indexOf(nonterminal_syms[0]);
            for (var j in grammar[nonterminal_syms[0]]){
                var temp_str = [];
                temp_str.push(result_list[i]);
                var flat_temp_str = temp_str.flat();
                // console.log(nonterminal_syms);
                flat_temp_str[index] = grammar[nonterminal_syms[0]][j];
                result_list.push(flat_temp_str.flat());
                // console.log(flat_temp_str.flat());   
            }
            result_list.shift();
        }
        nonterminal_syms.shift();
    }

    // console.log(result_list);
    return result_list;
}

function grm_traverse(grammar, start){
    // return all possible strings which can be generated by grammar
    var all_hypo = [];
    var worklist = [];
    worklist.push(grammar[start].flat());
    worklist.flat();
    while(worklist.length != 0){
        console.log(worklist);
        console.log("Looping...");
        if(is_hypo(worklist[0], grammar)){
            all_hypo.push(worklist[0]);
            console.log("Got 1 hypo: " + worklist[0]);
            worklist.shift();
        }
        worklist.push(allstr_generatedby(grammar, worklist[0]));
        // console.log(worklist);
        worklist.shift();
        worklist = worklist.flat();
        // console.log(worklist);   
    }
    // test = ['root'];
    // test = ['hypo'];
    // test = ['expr', 'op', '10'];
    // test = ['func', '(cost,price)', 'op', '10'];
    // // console.log(is_hypo(test, grammar));
    // // console.log(allstr_generatedby(grammar, test));
    // all_hypo.push(allstr_generatedby(grammar, test));

    return all_hypo.flat();
}

$(document).ready(function(){
    document.getElementById("input").addEventListener("change", updateAttr, false);

    const p = document.getElementById('testNTS').textContent 
                + document.getElementById('testNS').textContent;
    rules = p.trim().split('\n');
    var grammar = new tinynlp.Grammar(rules);
    grammar = grammar.lhsToRhsList;

    console.log(grammar);
    all_hypo = grm_traverse(grammar, 'root');
    console.log(all_hypo);
});