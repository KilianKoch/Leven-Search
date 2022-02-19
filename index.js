function conv(x){
    return 1/((1-x)*(1-x)) - 1;
}

function pass(input, compare, threshold = 0.5, Leven = false, ...attr){
    if(Leven){
        var wall = threshold;
    }else{
        var wall = conv(threshold);
    }
    if(attr.length == 0){
        if(threshold == 0){
            return input == compare;
        }else{
            return dist(input,compare) <= wall;
        }
    }else{
        for(let i = 0; i < attr.length; i++){
            if(threshold == 0 &&input[attr[i]] != compare[attr[i]]){
                return false;
            }else{
                if(dist(input[attr[i]],compare[attr[i]]) > wall){
                    return false;
                }
            }
        }
        return true;
    }
}

function search(input, data, threshold = 0.5, Leven = false, ...attr){
    var res = [];
    if(threshold >= 1 && !Leven){
        return data;
    }else if(threshold < 0){
        return res;
    }else{ // threshold \in [0,1)
        res = data.filter(compare => pass(input, compare, threshold, Leven, ...attr));
    }
    return res;
}

function dist(str1, str2){

    // O(n*m) Speicher
    var D = Array(str1.length + 1);
    //Damit n neue Arrays entstehen
    for(let i = 0; i <= str1.length; i++){
        D[i] = new Array(str2.length + 1);
    }

    for(let i = 0; i <= str1.length; i++){
        D[i][0] = i;
    }
    for(let i = 0; i <= str2.length; i++){
        D[0][i] = i;
    }

    // O(n*m) Laufzeit
    for(let i = 1; i <= str1.length; i++){
        for(let j = 1; j <= str2.length; j++){
            if(str1.charAt(i - 1) == str2.charAt(j - 1)){
                D[i][j] = Math.min(D[i-1][j-1], D[i][j-1] + 1, D[i-1][j] + 1);
            }else{
                D[i][j] = Math.min(D[i-1][j-1], D[i][j-1], D[i-1][j]) + 1;
            }
        }
    } 
    return D[str1.length][str2.length];
}

module.exports = {
    search: search,
    pass: pass,
    dist: dist
  };