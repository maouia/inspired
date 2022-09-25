function reset(id,email,name){
    Swal.fire({
        title: "Are you sure?",
        text: "You wont be able to revert this!",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Yes, Generate !",
        cancelButtonText: "No, cancel !",
        reverseButtons: true
    }).then(function (result) {
        if (result.value) {
            /*Swal.fire(
                    "Deleted!",
                    "Your file has been deleted.",
                    "success"
            )*/
            //document.getElementById("DeleteVideo").submit();
            var form = $('<form></form>');

            form.attr("method", "post");
            form.attr("action", `/admin/k04SuperInspireAccountsk04/new/password/admin/${id}/${email}/${name}`);

            // The form needs to be a part of the document in
            // order for us to be able to submit it.
            $(document.body).append(form);
            form.submit();
        }
    });
}

function sup(id){
    Swal.fire({
        title: "Are you sure?",
        text: "You wont be able to revert this!",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete !",
        cancelButtonText: "No, cancel !",
        reverseButtons: true
    }).then(function (result) {
        if (result.value) {
            /*Swal.fire(
                    "Deleted!",
                    "Your file has been deleted.",
                    "success"
            )*/
            //document.getElementById("DeleteVideo").submit();
            var form = $('<form></form>');

            form.attr("method", "post");
            form.attr("action", `/admin/k04SuperInspireAccountsk04/delete/admin/${id}`);

            // The form needs to be a part of the document in
            // order for us to be able to submit it.
            $(document.body).append(form);
            form.submit();
        }
    });
}
