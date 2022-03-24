function conv(x) {
    return 1 / ((1 - x) * (1 - x)) - 1;
}

function TypeException(message) {
    this.message = message;
    this.name = "TypeException";
}

function UndefinedException(message) {
    this.message = message;
    this.name = "UndefinedException";
}


function pass(input, compare, threshold = 0.5, Leven = false, ...attr) {
    if (Leven) {
        var wall = threshold;
    } else {
        var wall = conv(threshold);
    }
    if (attr.length == 0) {
        if (typeof input != "string" || typeof compare != "string") {
            throw new TypeException("String required, when attr = [].");
        }
        if (threshold == 0) {
            return input == compare;
        } else {
            return dist(input, compare) <= wall;
        }
    } else {
        for (let i = 0; i < attr.length; i++) {
            if (typeof attr[i] === 'object') {
                if (input[attr[i]] == undefined || compare[attr[i]] == undefined) {
                    throw new UndefinedException("The attr. \"" + attr[i] + "\" is not defined. \n" + JSON.stringify(input) + "\n" + JSON.stringify(compare));
                }
                if (typeof input[attr[i]] != "string" || typeof compare[attr[i]] != "string") {
                    throw new TypeException("The attr. \"" + attr[i] + "\" does not contain a String. \n" + JSON.stringify(input) + "\n" + JSON.stringify(compare));
                }
                if (threshold == 0 && input[attr[i]] != compare[attr[i]]) {
                    return false;
                } else {
                    if (dist(input[attr[i]], compare[attr[i]]) > wall) {
                        return false;
                    }
                }
            }else{
                let Pass = false;
                for(let j = 0; j < attr[i].In.length; j++){
                    if (input[attr[i].Search] == undefined || compare[attr[i].In[j]] == undefined) {
                        throw new UndefinedException("The attr. \"" + attr[i].Search + "\" or \"" + attr[i].In[j] + "\" is not defined. \n" + JSON.stringify(input) + "\n" + JSON.stringify(compare));
                    }
                    if (typeof input[attr[i].Search] != "string" || typeof compare[attr[i].In[j]] != "string") {
                        throw new TypeException("The attr. \"" + attr[i].Search + "\" or \"" + attr[i].In[j] + "\" does not contain a String. \n" + JSON.stringify(input) + "\n" + JSON.stringify(compare));
                    }
                    if (threshold == 0 && input[attr[i].Search] == compare[attr[i].In[j]]) {
                        Pass = true;
                        break;
                    } else {
                        if (dist(input[attr[i].Search], compare[attr[i].In[j]]) <= wall) {
                            Pass = true;
                            break;
                        }
                    }
                }
                if(!Pass){
                    return false;
                }
            }
        }
        return true;
    }
}

function search(input, data, threshold = 0.5, Leven = false, ...attr) {
    var res = [];
    if (threshold >= 1 && ! Leven) {
        return data;
    } else if (threshold < 0) {
        return res;
    } else { // threshold \in [0,1)
        res = data.filter(compare => pass(input, compare, threshold, Leven, ...attr));
    }
    return res;
}

function dist(str1, str2) { // O(n*m) Speicher
    var D = Array(str1.length + 1);
    // Damit n neue Arrays entstehen
    for (let i = 0; i <= str1.length; i++) {
        D[i] = new Array(str2.length + 1);
    }

    for (let i = 0; i <= str1.length; i++) {
        D[i][0] = i;
    }
    for (let i = 0; i <= str2.length; i++) {
        D[0][i] = i;
    }

    // O(n*m) Laufzeit
    for (let i = 1; i <= str1.length; i++) {
        for (let j = 1; j <= str2.length; j++) {
            if (str1.charAt(i - 1) == str2.charAt(j - 1)) {
                D[i][j] = Math.min(D[i - 1][j - 1], D[i][j - 1] + 1, D[i - 1][j] + 1);
            } else {
                D[i][j] = Math.min(D[i - 1][j - 1], D[i][j - 1], D[i - 1][j]) + 1;
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
