function compute(nth) {
    var plot_data = [];
    var selected = Object.keys(data["ptf"]).slice(0, nth)
    var colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#bcbd22']
    var colors_name = ["2019", "2020", "2021", "2022", "2023"];

    trace_year_no = Math.floor(selected.length / (365))

    for (var i = 0; i < trace_year_no; i++) {
        plot_data.push({
            type: 'scatterpolar',
            r: Object.values(data["ptf"]).slice(i * 365, (i + 1) * 365 +1),
            theta: Object.values(data["r"]).slice(i * 365, (i + 1) * 365 +1),
            mode: 'lines',
            name: colors_name[i],
            line: {
                color: colors[i]
            },
            opacity: 0.6 + 0.3 * (i + 1) / (trace_year_no + 1),
            hovertemplate: Object.values(data["hover"]).slice(i * 365, (i + 1) * 365 +1),
            showlegend: true,
        })
    }

    plot_data.push({
        type: 'scatterpolar',
        r: Object.values(data["ptf"]).slice(trace_year_no * 365, nth).reverse(),
        theta: Object.values(data["r"]).slice(trace_year_no * 365, nth).reverse(),
        mode: 'lines',
        name: colors_name[trace_year_no],
        line: {
            color: colors[trace_year_no]
        },
        opacity: 1,
        showlegend: true,
        hovertemplate: Object.values(data["hover"]).slice(trace_year_no * 365, nth).reverse()
    })


    for (var i = 0; i < 5 - trace_year_no; i++) {
        plot_data.push({
            type: 'scatterpolar',
            showlegend: false,
        })
    }
    return plot_data
}




layout = {
    plot_bgcolor: "rgb(17,17,17)",
    paper_bgcolor: "rgb(17,17,17)",
    showlegend: true,

    font: {
        family: 'Arial, sans-serif;',
        size: 12,
        color: 'white'
    },
    legend: {
        x: 0.02,
        y: 1
    },
    margin: {
        l: 5,
        r: 5,
        b: 25,
        t: 20,

    },
    polar: {
        bgcolor: "rgba(50,50,50, 0.5)",
        radialaxis: {
            visible: true,
            direction: "clockwise",
            angle: 0
        },
        angularaxis: {
            direction: "clockwise",
            tickvals: [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
            ticktext: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."]
        }
    }
}


var iter = 0; //  set your counter to 1
var pause = true
var StartFunctionClicked = false
var StopFunctionClicked = false
var stopValue = 1645
var slider = document.getElementById("Time");
plot_data = compute(iter)
Plotly.newPlot("graph", plot_data, layout)


function updateSlider(slideAmount) {
    slider.value = slideAmount;
    iter = slideAmount; //  set your counter to 1
    pause = true
    StartFunctionClicked = false
    StopFunctionClicked = false
    plot_data = compute(iter)
    Plotly.newPlot("graph", plot_data, layout)
}



function StopFunction() {
    if (StopFunctionClicked == false) {
        StopFunctionClicked = true
        StartFunctionClicked = false

        pause = true;
        run_simulation()
    }
}

function StartFunction() {
    if (iter == stopValue) {
        iter = 0; //  set your counter to 1
        pause = false
        StartFunctionClicked = false
        StopFunctionClicked = false
        plot_data = compute(iter)
        Plotly.newPlot("graph", plot_data, layout)
    }
    if (StartFunctionClicked == false) {
        StartFunctionClicked = true
        StopFunctionClicked = false
        pause = false;
        run_simulation()
    }
}

function run_simulation() {
    setTimeout(function () {
        if (iter >= stopValue) {
            console.log("Over");
            return
        }
        if (pause == true) {
            console.log("Pause");
            return
        }
        update()
        slider.value = iter

        iter++;
        if (iter < stopValue) {
            run_simulation()
        } else {
            console.log("Over");
            return
        }
    }, 30);
}




function update() {
    plot_data = compute(iter)
    Plotly.animate('graph', {
        data: plot_data,
        layout: layout,
        traces: [0, 1, 2, 3, 4, 5],

    }, {
        transition: {
            duration: 5,
            easing: 'cubic-in-out'

        },
        frame: {
            duration: 5,
            redraw: true,
        }
    });

}