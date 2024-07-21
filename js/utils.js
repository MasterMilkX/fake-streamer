
function randInt(min,max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// return random element from array
function randArr(arr){
    return arr[Math.floor(Math.random() * arr.length)];
}

// pick randomly based on weighted probabilities
function weightRandArr(arr, weights){   
    let rand = Math.random();
    let sum = 0;
    // assume the weights are normalized (0-1)
    for(let i=0;i<weights.length;i++){
        sum += weights[i];
        if(rand < sum){
            return arr[i];
        }
    }
    return arr[arr.length-1];
}

module.exports = {randInt, randArr, weightRandArr};