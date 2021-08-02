
window.onload = function () {
    var dataPoints2 = [];
    var chart = new CanvasJS.Chart("c2", {
        animationEnabled: true,
        // exportEnabled: true,
        // title: {
        //     text: "Desktop Search Engine Market Share - 2016"
        // },
        data: [{
            type: "pie",
            startAngle: 240,
            yValueFormatString: "##0.00\"%\"",
            indexLabel: "{label} {y}",
            dataPoints: dataPoints2
            // [
            //     { y: 79.45, label: "Google" },
            //     { y: 7.31, label: "Bing" },
            //     { y: 7.06, label: "Baidu" },
            //     { y: 4.91, label: "Yahoo" },
            //     { y: 1.26, label: "Others" }
            // ]
        }]
    });
    $.ajax({
        url: '/get_crime_logs',
        type: 'GET',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                dataPoints2.push({ y: data[i].crimeP, label: data[i].crimeName })
            };
            // alert(dataPoints);
            chart.render();
        },
        error: function (xhr, status, error) {
            console.log(error);
        },
    });
    var dataPoints = [];
    var stockChart = new CanvasJS.StockChart("c1", {
        animationEnabled: true,
        // /
        // subtitles: [{
        //     text: "Total Retail Sales of ACME "
        // }],
        charts: [{
            axisX: {
                crosshair: {
                    enabled: true,
                    snapToDataPoint: true,
                    valueFormatString: "DD MMM YYYY"
                }
            },
            axisY: {
                title: "Num Of Logs",
                crosshair: {
                    enabled: true,
                    snapToDataPoint: true,
                    valueFormatString: "##",
                }
            },
            data: [{
                type: "line",
                xValueFormatString: "DD MMM YYYY",
                yValueFormatString: "##",
                dataPoints: dataPoints
            }]
        }],
        navigator: {
            slider: {
                minimum: new Date(2010, 00, 01),
                maximum: new Date(2025, 00, 01)
            }
        }
    });
    $.ajax({
        url: '/get_all_logs',
        type: 'GET',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                dataPoints.push({ x: new Date(data[i].InsertionDate), y: Number(data[i].Num_Logs) })
            };
            // alert(dataPoints);
            stockChart.render();
        },
        error: function (xhr, status, error) {
            console.log(error);
        },
    });
    $.ajax({
        url: '/get_changes_in_record',
        type: 'GET',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            document.getElementsByClassName("changesCrimiRec")[0].textContent=data[0].ChangesinCriminalRec;
            document.getElementsByClassName("changesCrimiRec")[1].textContent=data[0].ChangesinCriminalRec;
            document.getElementsByClassName("changesCrimeRec")[0].textContent=data[0].ChangesinCrimeRec;
            document.getElementsByClassName("changesCrimeRec")[1].textContent=data[0].ChangesinCrimeRec;
        },
        error: function (xhr, status, error) {
            console.log(error);
        },
    });
}


