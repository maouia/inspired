function select(){
    //console.log($('#categorie option : selected').val())
    if(document.getElementById('categorie').value==='other'){
        $('#other_c').show(500);
    }
    else {
        $('#other_c').hide(500);
    }
}
$( document ).ready(function() {
    //console.log( "ready!" );
    $('#other_c').hide();
});

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
            form.attr("action", `/admin/k04SuperInspireAccountsk04/new/password/teacher/${id}/${email}/${name}`);

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
            form.attr("action", `/admin/k04SuperInspireAccountsk04/delete/teacher/${id}`);

            // The form needs to be a part of the document in
            // order for us to be able to submit it.
            $(document.body).append(form);
            form.submit();
        }
    });
}


function agree(id,uid){
    Swal.fire({
        title: "Are you sure?",
        text: "You wont be able to revert this!",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Yes, Agree !",
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
            form.attr("action", `/admin/k04SuperInspireAccountsk04/payment/agree/${id}/${uid}`);

            // The form needs to be a part of the document in
            // order for us to be able to submit it.
            $(document.body).append(form);
            form.submit();
        }
    });
}

function reject(id){
    Swal.fire({
        title: "Are you sure?",
        text: "You wont be able to revert this!",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Yes, Agree !",
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
            form.attr("action", `/admin/k04SuperInspireAccountsk04/payment/reject/${id}`);

            // The form needs to be a part of the document in
            // order for us to be able to submit it.
            $(document.body).append(form);
            form.submit();
        }
    });
}



function next(nbp){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if(parseInt(urlParams.get('page'))<nbp) {
        n = document.getElementById('next')
        n.href = window.location.href.split('?')[0] + '?page=' + (parseInt(urlParams.get('page')) + 1)
    }
}


function back(nbp){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if(parseInt(urlParams.get('page'))>1) {
        back = document.getElementById('back')
        back.href = window.location.href.split('?')[0] + '?page=' + (parseInt(urlParams.get('page')) - 1)
    }
}

