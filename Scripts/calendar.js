$(document).ready(function () {
    var events = [];
    var selectedEvent = null;
    FetchEventAndRenderCalendar();
    function FetchEventAndRenderCalendar() {
        events = [];
        $.ajax({
            type: "GET",
            url: "/calendar/GetEvents",
            success: function (data) {
                $.each(data, function (i, v) {
                    events.push({
                        eventID: v.eventID,
                        title: v.EventTitle,
                        attendees: v.attendees,
                        description: v.EventDescription,
                        start: moment(v.StartDate),
                        end: v.End != null ? moment(v.End) : null,
                        color: v.ThemeColor,
                        allDay: v.AllDay,
                        recurring: v.Recurring,
                        frequency: v.Frequency
                    });
                })

                GenerateCalender(events);
            },
            error: function (error) {
                alert('failed');
            }
        })
    }

    function GenerateCalender(events) {
        $('#calender').fullCalendar('destroy');
        $('#calender').fullCalendar({
            contentHeight: 400,
            defaultDate: new Date(),
            timeFormat: 'h(:mm)a',
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay,agenda'
            },
            eventLimit: true,
            eventColor: '#378006',
            events: events,
            eventClick: function (calEvent, jsEvent, view) {
                selectedEvent = calEvent;
                $('#myModal #eventTitle').text(calEvent.title);
                var $description = $('<div />');
                $description.append($('<p />').html('<b>Start Date :</b>' + calEvent.start.format("DD/MM/YYYY HH:mm:ss")));
                if (calEvent.end != null) {
                    $description.append($('<p/>').html('<b>End Date :</b>' + calEvent.end.format("DD/MM/YYYY HH:mm:ss")));
                }
                $description.append($('<p />').html('<b>Description :</b>' + calEvent.description));
                $description.append($('<p />').html('<b>Frequency :</b>' + calEvent.frequency));
                $('#myModal #pDetails').empty().html($description);

                $('#myModal').modal();
            },
            selectable: true,
            select: function (start, end) {
                selectedEvent = {
                    eventID: 0,
                    title: '',
                    description: '',
                    attendees:'',
                    start: start,
                    end: end,
                    allDay: false,
                    recurring: false,
                    frequency: '',
                    color: '',

                };
                openAddEditForm();
                $('#calendar').fullCalendar('unselect');
            },
            editable: true,
            eventDrop: function (event) {
                var data = {
                    EventID: event.eventID,
                    EventTitle: event.title,
                    EventDescription: event.description,
                    StartDate: event.start.format('DD/MM/YYYY HH:mm:ss'),
                    EndDate: event.end != null ? event.end.format('DD/MM/YYYY HH:mm:ss') : null,
                    ThemeColor: event.Color,
                    AllDay: event.allDay,
                    Recurring: event.Recurring,
                    Frequency: event.frequency

                };
                SaveEvent(data);
            },

        })
    }

    $('#btnEdit').click(function () {
        //Open modal dialog for edit event
        openAddEditForm();

    })
    $('#btnDelete').click(function (eventID) {
        if (confirm('Are you sure to Delete this record ?')) {

            $.ajax({

                type: "POST",
                url: '/calendar/DeleteEvent' + eventID,
                success: function (data) {

                    if (data.success) {

                        $.notify(data.message, {
                            globalPosition: "top center",
                            className: "success"
                        })

                    }
                }

            });
        }
    })

    $('#txtStart').datetimepicker({
        local: 'LT'
    });
    $('#txtEnd').datetimepicker({
        local: 'LT'
    });

    $('#chkIsFullDay').change(function () {
        if ($(this).is(':checked')) {
            $('#divEndDate').hide();
        }
        else {
            $('#divEndDate').show();
        }
    });

    $('#chckReccuring').change(function () {
        if ($(this).is(':checked')) {
            $('#divFrequency').show();
        }
        else {
            $('#divFrequency').hide();
        }
    });
    function openAddEditForm() {
        if (selectedEvent != null) {
            $('#hdEventID').val(selectedEvent.eventID);
            $('#txtTitle').val(selectedEvent.title);
            $('#txtAttendee').val(selectedEvent.Fullname);
            $('#txtStart').val(selectedEvent.start.format("DD/MM/YYYY HH:mm:ss"));
            $('#chkIsFullDay').prop("checked", selectedEvent.allDay || false);
            $('#chkIsFullDay').change();
            $('#txtEnd').val(selectedEvent.end != null ? selectedEvent.end.format('DD/MM/YYYY HH:mm:ss') : '');
            $('#txtDescription').val(selectedEvent.description);
            $('#ddThemeColor').val(selectedEvent.color);
            $('#chckReccuring').prop("checked", selectedEvent.recurring || false);
            $('#chckReccuring').change();
            $('#ddFrequency').val(selectedEvent.frequency);
        }
        $('#myModal').modal('hide');
        $('#myModalSave').modal();
    }

    // call function for submit data to the server
    $('#btnSave').click(function () {
        //Validation/
        if ($('#txtTitle').val().trim() == "") {
            alert('Meeting Title required');
            return;
        }
  
        if ($('#txtStart').val().trim() === "") {
            alert('Start date required');
            return;
        }
        if ($('#chkIsFullDay').is(':checked') == false && $('#txtEnd').val().trim() == "") {
            alert('End date required');
            return;
        }
        else {
            var startDate = moment($('#txtStart').val(), "DD/MM/YYYY HH:mm:ss").toDate();
            var endDate = moment($('#txtEnd').val(), "DD/MM/YYYY HH:mm:ss").toDate();
            if (startDate > endDate) {
                alert('Invalid end date');
                return;
            }
        }
        // insert event data to the server
        var data = {
            EventID: $('#hdEventID').val(),
            EventTitle: $('#txtTitle').val().trim(),
            StartDate: $('#txtStart').val().trim(),
            EndDate: $('#txtEnd').is(':checked') ? null : $('#txtEnd').val().trim(),
            EventDescription: $('#txtDescription').val(),
            ThemeColor: $('#ddThemeColor').val(),
            AllDay: $('#chkIsFullDay').is(':checked'),
            Recurring: $('#chckReccuring').is(':checked'),
            Frequency: $('#ddFrequency').val()
        }
        SaveEvent(data);

        // insert event data to the server
        var Attenddata = {

            userId: $('#txtAttendee').val() + ",",
            EventID: $('#hdEventID').val()
            
        }
        saveAttendees(Attenddata);
    })
    function SaveEvent(data) {
        $.ajax({
            async: true,
            type: "POST",
            url: '/calendar/SaveEvent',
            data: data,
            success: function (data) {
                if (data.status) {
                    //Refresh the calender
                    FetchEventAndRenderCalendar();
                    $('#myModalSave').modal('hide');
                }
            },
            error: function () {
                alert('Failed');
            }
        })
    }

    function saveAttendees(Attenddata) {
 
        $.ajax({
            url: '/attendee/SaveAttendee',
            dataType: 'text',
            type: 'Post',
            data: Attenddata,
            success: function (data) {
                if (data.status) {
                    //Refresh the calender
                    FetchEventAndRenderCalendar();
                    $('#myModalSave').modal('hide');
                }
            },
        });

    }

})