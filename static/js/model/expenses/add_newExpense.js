const everyDMY_model = document.getElementById('everyDMY_model');
const custom_model = document.getElementById('custom_model');
const withoutRepeat_model = document.getElementById('withoutRepeats_model');


function selectTypeOfProfit() {
    const expenseModel = document.getElementById('expenseModal');
    expenseModel.style.display = 'block';
}


document.getElementById('createExpense').addEventListener('click', selectTypeOfProfit);


$(document).ready(function(){
    $("select.profitType").change(function(){
        var selectedType = $(this).children("option:selected").val();

        if (selectedType === 'option4') {
            custom_model.style.display = 'block';
            everyDMY_model.style.display = 'none';
            withoutRepeat_model.style.display = 'none';

            document.getElementById('custom_form').addEventListener('submit', (e) => {
                e.preventDefault();

                const formAmount = document.getElementById('custom_amount').value;
                const formName = document.getElementById('custom_name').value;
                const formSDate = document.getElementById('custom_startDate').value;
                const formFDate = document.getElementById('custom_finishDate').value;
                const formReplayDays = document.getElementById('custom_replayDays').value;



                fetch('http://127.0.0.1:8000/finance/expenses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        query: `
                                mutation {
                                  createExpense(
                                    amount: ${formAmount}
                                    customReplayDays: ${formReplayDays}
                                    finishDate: "${formFDate}"
                                    modelId: "${modelId}"
                                    name: "${formName}"
                                    replayTypeId: "4"
                                    startDate: "${formSDate}"
                                  ) {
                                    expense {
                                      id
                                      name
                                      startDate
                                      amount
                                      customReplayDays
                                      finishDate
                                    }
                                  }
                                }
                            `
                    })
                })
                location.reload()
            })


        } else if (selectedType === 'option5') {
            withoutRepeat_model.style.display = 'block';
            everyDMY_model.style.display = 'none';
            custom_model.style.display = 'none';

            document.getElementById('withoutRepeats_form').addEventListener('submit', (e) => {
                e.preventDefault();

                const formAmount = document.getElementById('withoutRepeats_amount').value;
                const formName = document.getElementById('withoutRepeats_name').value;
                const formSDate = document.getElementById('withoutRepeats_startDate').value;



                fetch('http://127.0.0.1:8000/finance/expenses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        query: `
                                mutation {
                                  createExpense(
                                    amount: ${formAmount}
                                    modelId: "${modelId}"
                                    name: "${formName}"
                                    replayTypeId: "5"
                                    startDate: "${formSDate}"
                                  ) {
                                    expense {
                                      id
                                      name
                                      startDate
                                      amount
                                      customReplayDays
                                      finishDate
                                    }
                                  }
                                }
                            `
                    })
                })
                location.reload()
            })


        } else {
            everyDMY_model.style.display = 'block';
            custom_model.style.display = 'none'
            withoutRepeat_model.style.display = 'none';


            let type;

            if (selectedType === 'option1') {
                type = 1;
            } else if (selectedType === 'option2') {
                type = 2;
            } else {
                type = 3;
            }

            document.getElementById('everyDMY_form').addEventListener('submit', (e) => {
                e.preventDefault();

                const formAmount = document.getElementById('everyDMY_amount').value;
                const formName = document.getElementById('everyDMY_name').value;
                const formSDate = document.getElementById('everyDMY_startDate').value;
                const formFDate = document.getElementById('everyDMY_finishDate').value;



                fetch('http://127.0.0.1:8000/finance/expenses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        query: `
                                mutation {
                                  createExpense(
                                    amount: ${formAmount}
                                    finishDate: "${formFDate}"
                                    modelId: "${modelId}"
                                    name: "${formName}"
                                    replayTypeId: "${type}"
                                    startDate: "${formSDate}"
                                  ) {
                                    expense {
                                      id
                                      name
                                      startDate
                                      amount
                                      customReplayDays
                                      finishDate
                                    }
                                  }
                                }
                            `
                    })
                })
                location.reload()
            })

        }
    });
});
