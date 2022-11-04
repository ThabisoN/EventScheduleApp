var Popup, dataTable;

$(document).ready(function () {
    dataTable = $("#UserTable").DataTable({

        "ajax": {

            "url": "/User/GetData",
            "type": "GET",
            "datatype": "json"
        },

        "columns": [
            { "data": "UserId" },
            { "data": "Firstname" },
            { "data": "Surname" },
            { "data": "Email" },
            {
                "data": "UserId", "render": function (data) {

                    return "<a class='btn btn-default btn-sm' onclick=PopupForm('@Url.Action("SaveUpdate", "User")/" + data + "')><i class='fa fa-pencil'></i>Edit</a> <a class='btn btn-danger btn-sm' style='margin-left:5px' onclick=Delete(" + data + ")><i class='fa fa-trash'></i>Delete</a>";
                },

                "orderable": false,
                "searchable": false,
                "width": "150px"
            }


        ],

        "language": {
            "emptyTable": "No data found please click on <b>Add New </b> Button"
        }

    });
});

function PopupForm(url) {

    var formDiv = $('<div/>');
    $.get(url)
        .done(function (response) {

            formDiv.html(response);

            Popup = formDiv.dialog({

                autoOpen: true,
                resizable: false,
                title: 'Fill User Details',
                height: 500,
                width: 700,
                close: function () {

                    Popup.dialog('destroy').remove();
                }

            });

        });
}

function SubmitForm(form) {

    $.validator.unobtrusive.parse(form);
    if ($(form).valid()) {

        $.ajax({
            type: "POST",
            url: form.action,
            data: $(form).serialize(),
            success: function (data) {

                if (data.success) {

                    Popup.dialog('close');
                    dataTable.ajax.reload();

                    $.notify(data.message, {
                        globalPosition: "top center",
                        className: "success"
                    })


                }
            }
        });
    }

    return false;

}

function Delete(id) {
    if (confirm('Are you sure to Delete this record ?')) {

        $.ajax({

            type: "POST",
            url: '@Url.Action("Delete","User")/' + id,
            success: function (data) {

                if (data.success) {

                    dataTable.ajax.reload();

                    $.notify(data.message, {
                        globalPosition: "top center",
                        className: "success"
                    })

                }
            }

        });
    }
}