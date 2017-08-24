let TimeControl = (function() {

    let timeInHours;
    let currentDay;

    let init = function(App) {
        
       initDayPicker();
       initTimeSlider();
    };


    let initDayPicker = function() {
        
        let radio_home = document.getElementById("daycontrol");
        let monday_button = makeRadioButton("daycontrol", "monday", "Mon");
        let tuesday_button = makeRadioButton("daycontrol", "tuesday", "Tue");
        let wednesday_button = makeRadioButton("daycontrol", "wednesday", "Wed");
        let thrusday_button = makeRadioButton("daycontrol", "thursday", "Thurs");
        let friday_button = makeRadioButton("daycontrol", "friday", "Fri");
        let saturday_button = makeRadioButton("daycontrol", "saturday", "Sat");
        let sunday_button = makeRadioButton("daycontrol", "sunday", "Sun");

        

        radio_home.appendChild(monday_button);
        radio_home.appendChild(tuesday_button);
        radio_home.appendChild(wednesday_button);
        radio_home.appendChild(thrusday_button);
        radio_home.appendChild(friday_button);
        radio_home.appendChild(saturday_button);
        radio_home.appendChild(sunday_button);

        $('input[type=radio][name=daycontrol]').on('change', function() {
            currentDay = $(this).val();
            App.update(timeInHours, currentDay); 
          
        });
    };

    let initTimeSlider = function() {
        let slider = document.getElementById('timecontrol');
        noUiSlider.create(slider, {
            start: getTimeInMinutes(),
            connect: [true, false],
            tooltips: [  false],

            animate: false,
             pips: {
                mode: 'values',
                values: [0, 360, 720, 1080, 1440],
                density: 4,
                format: wNumb({
                    decimals: 0,
                    encoder: function(value) {
                        return value/60;
                    }
                })
            },
            range: {
                min: 0,
                max: 1440
            }  
        });

        slider.noUiSlider.on('update', function( values, handle ){
       
            timeInHours = convertValuesToTime(values, handle);
            timeInHours = timeInHours[0];
            App.update(timeInHours, currentDay);
        });
    };

    let makeRadioButton = function(name, value, text) {

        var label = document.createElement("label");
        var radio = document.createElement("input");
        radio.type = "radio";
        radio.name = name;
        radio.value = value;
        if(value == moment().format("dddd").toLowerCase())
        {
            radio.checked = true;
            currentDay = value;
        } 
        label.appendChild(radio);

        label.appendChild(document.createTextNode(text));
        return label;
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