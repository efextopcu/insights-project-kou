/* Variables START */
var sampleNotes = {
    midterm: Array.from({
        length: 100
    }, () => Math.floor(Math.random() * 100)),
    final: Array.from({
        length: 100
    }, () => Math.floor(Math.random() * 100)),
    calculatedNotes: [],
    finalScoresAndCounts: [{x: 'AA', y: 0}, {x: 'BA', y: 0}, {x: 'BB', y: 0}, {x: 'BC', y: 0}, {x: 'CC', y: 0}, {x: 'DC', y: 0}, {x: 'DD', y: 0}, {x: 'FD', y: 0}, {x: 'FF', y: 0}]
};
var noteRange = [{Note: 'FF', Limit: 24}, {Note: 'FD', Limit: 29}, {Note: 'DD', Limit: 34}, {Note: 'DC', Limit: 39}, {Note: 'CC', Limit: 44}, {Note: 'BC', Limit: 49}, {Note: 'BB', Limit: 54}, {Note: 'BA', Limit: 59}, {Note: 'AA', Limit: 101}];
var standartDeviation = 0;
var classDSN = 0;
var notesX = [];
var notesY = [];
/* Variables END */

function init() {
    calculateFinalScore(70);
    calculateAndAssignStudentNotes();
    createBarPlot();
}

function calculateFinalScore(finalPercantage) {
    for (let index = 0; index < sampleNotes.midterm.length; index++) {
        sampleNotes.calculatedNotes.push(Math.round(((sampleNotes.midterm[index] * (100 - finalPercantage)) / 100) +
            ((sampleNotes.final[index] * finalPercantage) / 100)))
    }

    removeUnsuccesfullStudents();
}

function removeUnsuccesfullStudents() {
    var succesfullStudentsArray = sampleNotes.calculatedNotes.filter(note => note >= 15);

    calculateClassAverageDSN(succesfullStudentsArray);
}

function calculateClassAverageDSN(studentsArray) {
    for (let index = 0; index < studentsArray.length; index++) {
        classDSN = studentsArray.reduce((a, b) => a + b, 0) / studentsArray.length;
    }

    $('#class-dsn').text('Dersin/Derslerin Sınıf Ortalaması = ' + classDSN);

    findClassNotingCriteria(classDSN);
}

function findClassNotingCriteria(classDSN) {
    var balanceRange = 0;

        if (classDSN > 62.5 && classDSN <=70) {
            balanceRange += 2
        }
        else if (classDSN > 57.5 && classDSN <=62.5){
            balanceRange += 4
        }
        else if (classDSN > 52.5 && classDSN <=57.5){
            balanceRange += 6
        }
        else if (classDSN > 47.5 && classDSN <=52.5){
            balanceRange += 8
        }
        else if (classDSN > 42.5 && classDSN <=47.5){
            balanceRange += 10
        }
        else if (classDSN <= 42.5){
            balanceRange += 12
        }

    noteRange.forEach(element => {
        element.Limit += balanceRange;
    });
}

function calculateAndAssignStudentNotes() {
    standartDeviation = getStandardDeviation(sampleNotes.calculatedNotes);

    sampleNotes.calculatedNotes.forEach(note => {
        var tNote = (((note - classDSN) / standartDeviation) * 10) + 50;
        var rangeNote;
        for (let index = 0; index < noteRange.length; index++) {
            if (tNote < noteRange[index].Limit) {
                rangeNote = noteRange[index].Note;
                break;
            }  
        }

        sampleNotes.finalScoresAndCounts.find(function(finalScore, index) {
            if (finalScore.x === rangeNote) {
                sampleNotes.finalScoresAndCounts[index].y += 1;
                return true;
            }
        })
    });

    /* Print Note Range START */
    var reversedArray = noteRange.reverse();

    for (let index = 0; index < 9; index++) {
        if (index === 0) {
            $('#tNoteHeaderRow td:nth-Child(' + (index + 1) + ')').text(100 + ' < X ≤ ' + reversedArray[index + 1].Limit);
        } else if (index === 8 ) {
            $('#tNoteHeaderRow td:nth-Child(' + (index + 1) + ')').text(reversedArray[index].Limit + ' < X ≤ ' + 0);
        } else {
            $('#tNoteHeaderRow td:nth-Child(' + (index + 1) + ')').text(reversedArray[index].Limit + ' < X ≤ ' + reversedArray[index + 1].Limit);
        }
    }
    /* Print Note Range END */
}

function getStandardDeviation(array) {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    var deviation = Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);

    $('#standart-deviation').text('Dersin/Derslerin Standart Sapması = ' + deviation);

    return deviation;
}

function createBarPlot() {
    sampleNotes.finalScoresAndCounts.forEach(element => {
        notesX.push(element.x);
        notesY.push(element.y);
    });

    var myChart = new Chart("pieChart", {
        type: "doughnut",
        data: {
            labels: notesX,
            datasets: [{
                backgroundColor: [
                    'rgb(0, 116, 63)',
                    'rgb(37, 179, 150)',
                    'rgb(112, 206, 208)',
                    'rgb(241, 161, 4)',
                    'rgb(255, 234, 162)',
                    'rgb(252, 214, 57)',
                    'rgb(255,186,186)',
                    'rgb(255,82,82)',
                    'rgb(167,0,0)',
                  ],
                data: notesY
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'left',
                }
            }
        }
    });

    var barChart = new Chart("barChart", {
        type: "bar",
        data: {
            labels: notesX,
            datasets: [{
                backgroundColor: [
                    'rgb(0, 116, 63)',
                    'rgb(37, 179, 150)',
                    'rgb(112, 206, 208)',
                    'rgb(241, 161, 4)',
                    'rgb(255, 234, 162)',
                    'rgb(252, 214, 57)',
                    'rgb(255,186,186)',
                    'rgb(255,82,82)',
                    'rgb(167,0,0)',
                  ],
                data: notesY
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                }
            },
            aspectRatio: 1.5
        }
    });
}

init();