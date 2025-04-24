$(document).ready(() => {
    $("#checkout-form").submit(function (event) {
        event.preventDefault(); 

        const formData = {
            name: $("#name").val(),
            address: $("#address").val()
        };

        $.ajax({
            url: "/checkout", 
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: (response) => {
                $("#checkout-message").html("<p>Order placed successfully!</p>");
            },
            error: (xhr) => {
                $("#checkout-message").html(`<p>Error: ${xhr.responseText}</p>`);
            }
        });
    });
});
