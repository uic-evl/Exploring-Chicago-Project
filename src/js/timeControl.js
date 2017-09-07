let TimeControl = (function() {

    let timeInHours;
    let timeInMinutes;
    let currentDay;

    let init = function(App) {
        
       initToggleButton();
       initDayPicker();
       initTimeSlider();
       initHourButton();
       toggleControlPanel();
    };

    let initToggleButton = function() {
        let controlPanel = document.getElementById('controlpanel');
        let isSelected = false;
        let toggleButton = document.createElement("input");

        toggleButton.type = "button";
        toggleButton.id = "controlPanelToggleButton"
        toggleButton.value = "Control Panel Show";
        controlPanel.appendChild(toggleButton);

        $('input[type=button][id=controlPanelToggleButton]').on('click', function() {
            isSelected = !isSelected;
            if(isSelected)
                toggleButton.value = "Control Panel Hide";
            else  
                 toggleButton.value = "Control Panel Show";
            
            toggleControlPanel();

        });

    }

    let toggleControlPanel = function() {

        $('#daycontrol').toggle();
        $('#timecontrol').toggle();
        $('#nexthourcontrol').toggle();
    }

    let initHourButton = function() {
        
        let nextHourControl = document.getElementById("nexthourcontrol");

        let prevHourButton = document.createElement("input");
        prevHourButton.type = "button";
        prevHourButton.value = "Prev Hour";
        prevHourButton.id = "prevHourButton";
        nextHourControl.appendChild(prevHourButton);

        let nextHourButton = document.createElement("input");
        nextHourButton.type = "button";
        nextHourButton.value = "Next Hour";
        nextHourButton.id = "nextHourButton";
        nextHourControl.appendChild(nextHourButton);
        
        $('input[type=button][id=nextHourButton]').on('click', function() {
         timeInMinutes = parseFloat(timeInMinutes[0]);
        
            if(timeInMinutes + 60 > 1440) 
                timeInMinutes = 1380;

            timeInMinutes += 60;

            updateSlider();
        });

        $('input[type=button][id=prevHourButton]').on('click', function() {
            timeInMinutes = parseFloat(timeInMinutes[0]);
        
            if(timeInMinutes - 60 < 0) 
                timeInMinutes = 60;

            timeInMinutes -= 60;
            
            updateSlider();
        });
       
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
       
            timeInMinutes = values;
            timeInHours = convertValuesToTime(values);
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

    let convertValuesToTime = function(values) {
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

    let updateSlider = function() {
         let slider = document.getElementById('timecontrol');
        slider.noUiSlider.set(timeInMinutes)
        timeInHours = convertValuesToTime(timeInMinutes);
        timeInHours = timeInHours[0];
        App.update(timeInHours, currentDay); 
    }

    return {
        show: init
    }
})();