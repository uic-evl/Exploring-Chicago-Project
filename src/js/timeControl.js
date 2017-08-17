let TimeControl = (function() {

    let init = function(App) {
        

        let slider = document.getElementById('timecontrol');
        noUiSlider.create(slider, {
            start: getTimeInMinutes(),
            connect: [true, false],
            tooltips: [  false],

            animate: false,
             pips: {
                mode: 'values',
                values: [0, 360, 720, 1080, 1440],
                density: 10
            },
            range: {
                min: 0,
                max: 1440
            }  
        });

        slider.noUiSlider.on('update', function( values, handle ){
       
            timeInHours = convertValuesToTime(values, handle);
            timeInHours = timeInHours[0];
            App.update(timeInHours);
        });

    };

    let convertValuesToTime = function(values, handle) {

        values = values
        .map(value => Number(value) % 1440)
        .map(value => convertMinutesToHoursAndMinutes(value));

        return values;
    };

    let convertMinutesToHoursAndMinutes = function(minutes) {
        let meridian =' AM';
        if(minutes>720)
            meridian = ' PM';
        let hour = Math.floor(minutes / 60);
        let minute = minutes - hour * 60;
        if(minute.length == 1)
         minute = '0'+minute;
        return hour + ':' + minute + meridian;
    }

    let getTimeInMinutes = function() {
        let time = moment().format('HH:mm')
        let a = time.split(':');
        let minutes = (+a[0]) * 60 + (+a[1]);
        return parseInt(minutes);
    }

    return {
        show: init
    }

})();