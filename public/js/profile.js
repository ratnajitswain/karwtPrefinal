$(document).ready(function () {
    $('body').append('<script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>')
    $('.profile-button').on('click', function () {
        var fd = new FormData(document.getElementById('profileFormdata'));

        $.ajax({
            url: '/users/updateProfile',
            method: 'POST',
            processData: false,
            contentType: false,
            data: fd,
            success: function (res) {
                Swal.fire('Saved!', '', 'success').then((result) => { if (result.isConfirmed) { location.reload(); } })
            }
        })


    })



    var readURL = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.profile-pic').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }


    $(".file-upload").on('change', function () {
        readURL(this);
    });

    $(".upload-button").on('click', function () {

        $(".file-upload").click();
    });


    var ad1 = $('.dnoneform1').val()



    $.ajax({
        url: '/fetchAllStates',
        method: 'get',
        success: function (res) {
            res.forEach((s) => {

                if (s.TSM_State_Name == ad1) {
                    $('#states').append(`<option value="${s.TSM_State}" selected>${s.TSM_State_Name}</option>`)

                    var ad2 = $('.dnoneform2').val()

                    $.ajax({
                        url: '/fetchDistByStateId?id=' + s.TSM_State,
                        method: 'get',
                        success: function (res) {
                            res.forEach((d) => {

                                if (d.TDM_Dist_Name == ad2) {

                                    $('#dists').append(`<option value="${d.TDM_Dist}" selected >${d.TDM_Dist_Name}</option>`)

                                    var ad3 = $('.dnoneform3').val()

                                    $.ajax({
                                        url: '/fetchConstByDistId?id=' + d.TDM_Dist,
                                        method: 'get',
                                        success: function (res) {
                                            if (res.length != 0) {
                                                res.forEach((d) => {


                                                    if (d.TCM_Const_Name == ad3) {
                                                        $('#consts').append(`<option value="${d.TCM_Const}" selected>${d.TCM_Const_Name}</option>`)

                                                    }
                                                    else {
                                                        $('#consts').append(`<option value="${d.TCM_Const}">${d.TCM_Const_Name}</option>`)

                                                    }

                                                })
                                            }
                                            else {
                                                $('#consts').append(``)
                                            }

                                        }
                                    })


                                }
                                else {
                                    $('#dists').append(`<option value="${d.TDM_Dist}"  >${d.TDM_Dist_Name}</option>`)


                                }

                            })

                        }
                    })

                }
                else {
                    $('#states').append(`<option value="${s.TSM_State}">${s.TSM_State_Name}</option>`)
                }
            })
        }
    })











});

function fetchDist(e) {

    var ad2 = $('.dnoneform2').val()
    $('#dists').html('')
    $.ajax({
        url: '/fetchDistByStateId?id=' + e.value,
        method: 'get',
        success: function (res) {
            res.forEach((d) => {




                $('#dists').append(`<option value="${d.TDM_Dist}" >${d.TDM_Dist_Name}</option>`)




            })

        }
    })
}


function fetchConst(e) {
    var ad3 = $('.dnoneform3').val()
    $('#consts').html('')
    $.ajax({
        url: '/fetchConstByDistId?id=' + e.value,
        method: 'get',
        success: function (res) {
            if (res.length != 0) {
                res.forEach((d) => {





                    $('#consts').append(`<option value="${d.TCM_Const}">${d.TCM_Const_Name}</option>`)



                })
            }
            else {
                $('#consts').append(``)
            }

        }
    })
}


async function changePass() {
    Swal.fire({
        title: 'Enter your old password',
        input: 'password',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Next',
        showLoaderOnConfirm: true,
        preConfirm: (password) => {
            return fetch(`/users/checkpass?password=${password}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText)
                    }
                    return response.json()
                })
                .catch(error => {
                    Swal.showValidationMessage(
                        `Request failed: ${error}`
                    )
                })
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then(async (result) => {
        if (result.isConfirmed) {
            if (result.value.message == 'success') {
                const { value: formValues } = await Swal.fire({
                    title: 'Reset password',
                    html:
                        '<input type="password" id="swal-input1" placeholder="New Password" class="swal2-input">' +
                        '<input type="password" id="swal-input2" placeholder="Confirm Password" class="swal2-input">',
                    focusConfirm: false,
                    showCancelButton: true,
                    preConfirm: async () => {

                        let formValue = await [document.getElementById('swal-input1').value,
                        document.getElementById('swal-input2').value]


                        if (formValue[0] == formValue[1]) {

                            return fetch(`/users/changepassword?password=${formValue[1]}`)
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error(response.statusText)
                                    }
                                    return response.json()
                                })
                                .catch(error => {
                                    Swal.showValidationMessage(
                                        `Request failed: ${error}`
                                    )
                                })

                        } else {
                            Swal.showValidationMessage(
                                `password not matching`
                            )
                        }
                    },
                    allowOutsideClick: () => !Swal.isLoading()
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire('Saved!', '', 'success')
                    }
                })

                if (formValues) {

                }
            } else {
                Swal.fire('wrong password', '', 'warning')
            }

        }
    })







    // Swal.fire({
    //     title: 'Do you want to save the changes?',
    //     showDenyButton: true,
    //     showCancelButton: true,
    //     confirmButtonText: `Save`,
    //     denyButtonText: `Don't save`,
    //   }).then((result) => {
    //     /* Read more about isConfirmed, isDenied below */
    //     if (result.isConfirmed) {
    //       Swal.fire('Saved!', '', 'success')
    //     } else if (result.isDenied) {
    //       Swal.fire('Changes are not saved', '', 'info')
    //     }
    //   })
}
function logout() {
    Swal.fire({
        title: 'Are you sure ?',
        icon:'warning',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {



            let timerInterval
            Swal.fire({
                title: 'Logging out ...',
                html: 'You will be logout in <b></b> milliseconds.',
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                    timerInterval = setInterval(() => {
                        const content = Swal.getHtmlContainer()
                        if (content) {
                            const b = content.querySelector('b')
                            if (b) {
                                b.textContent = Swal.getTimerLeft()
                            }
                        }
                    }, 100)
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            }).then((result) => {
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                    location.href = '/logout'
                }
            })
            
        } else if (result.isDenied) {
            Swal.fire('Thank You!', '', 'success')
        }
    })
}


function numberValid(e){ 
 
    
        var value = $('#'+e.id).val();
        if(isNaN(value)){  
            $('#'+e.id).val(value.slice(0, -1))
        }
   
}