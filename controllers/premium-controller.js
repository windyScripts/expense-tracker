const User = require('../models/user-model');
const Expenses = require('../models/expenses-model');

exports.showLeaderboards = async (req,res,next) => {
 try{
    const users = await User.findAll();
    const expenses = await Expenses.findAll();
    const userAggregatedExpenses = {};
    //console.log("All users:", JSON.stringify(users, null, 2));
    expenses.forEach((expense)=>{
        if(userAggregatedExpenses[expense.userDetailId])
        userAggregatedExpenses[expense.userId] += expense.price;
        else userAggregatedExpenses[expense.userDetailId] = expense.price;
    })
    //console.log(userAggregatedExpenses);
    const userLeaderBoardDetails = [];
    users.forEach(user => {
        userLeaderBoardDetails.push({name:user.name, total_cost: userAggregatedExpenses[user.id]??0})
    })
    userLeaderBoardDetails.sort((a,b) => b.total_cost-a.total_cost)
    
/*     for(let i = 0; i < userLeaderBoardDetails.length; i++){
        let cindex = i;
        for(let j = i+1; j < userLeaderBoardDetails.length; j++){
            if(userLeaderBoardDetails[j].total_cost<userLeaderBoardDetails[cindex].total_cost)
            cindex = j;
        }
        let temp = userLeaderBoardDetails[i];
        userLeaderBoardDetails[i] = userLeaderBoardDetails[cindex];
        userLeaderBoardDetails[cindex] = temp;
    } */
    console.log(userLeaderBoardDetails)
}
 catch(err) {
    console.log(err);
 }
}