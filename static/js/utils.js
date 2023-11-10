function formatDate(date){
    let split_date = String(date).split("-");
    return split_date[2] + "." + split_date[1] + "." + split_date[0];
}

// function formatAmount(amount){
//     return Number(amount).toLocaleString("ru-RU", { style: "currency", currency: "RUB" });
// }

function formatAmount(amount) {
    const formattedAmount = Number(amount).toLocaleString("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: 2, style: "currency", currency: "RUB" });
    return formattedAmount.endsWith('.00') ? formattedAmount.slice(0, -3) : formattedAmount;
}

function formatFinanceOperation(type, name, amount){
    result = null
    if (type === "profit"){
        result = "+ " + formatAmount(amount) + " " + name
    }
    else{
        if (type === "expense"){
            result = "- " + formatAmount(amount) + " " + name
        }
        else{
            result = "error"
        }
    }
    return result
}