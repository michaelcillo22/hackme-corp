{{!-- Using AJAX PUT and DELETE requests to: 
put items in cart, update items in cart, remove an item from cart, and clear cart completely --}}

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
    $(document).ready(function () {

        function updateItemCount() {
            const itemCount = $('#cart-items li').length;
            $(".items").text(itemCount + " item(s) in cart");
        }

        function updateTotalPrice() {
            let total = 0;
            $('#cart-items li').each(function () {
                const price = parseFloat($(this).data('price'));
                const quantity = parseInt($(this).find('.quantity').text(), 10);
                total += price * quantity;
            });
            $("p strong").text("Total: $" + total.toFixed(2));
        }

        updateItemCount();
        updateTotalPrice();

        // Update quantity
        $('.update-quantity').on('click', function (event) {
            const productId = $(this).data('product-id');
            const input = $(this).siblings('.quantity-input');
            const newQuantity = input.val();
            const userId = '{{userId}}';

            $.ajax({
                url: '/cart/update',
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({
                    userId: userId,
                    productId: productId,
                    quantity: newQuantity
                }),
                success: function (result) {
                    console.log('Cart updated:', result);
                    input.hide();
                    input.siblings('.quantity').text(newQuantity);
                    updateTotalPrice();
                },
                error: function (xhr, status, error) {
                    console.error('Error updating cart:', error);
                }
            });
        });

        // Remove item
        $('.remove-item').on('click', function (event) {
            const productId = $(this).data('product-id');
            const userId = '{{userId}}';

            $.ajax({
                url: '/cart/remove/' + userId + '/' + productId,
                type: 'DELETE',
                success: function (result) {
                    console.log('Item removed from cart:', result);
                    $(`li[data-product-id="${productId}"]`).remove();
                    updateItemCount();
                    updateTotalPrice();
                },
                error: function (xhr, status, error) {
                    console.error('Error removing item from cart:', error);
                }
            });
        });

        // Clear cart
        $('#clear-cart').on('click', function (event) {
            const userId = $(this).data('user-id');

            $.ajax({
                url: '/cart/clear/' + userId,
                type: 'DELETE',
                success: function (result) {
                    console.log('Cart cleared:', result);
                    $('#cart-items').empty();
                    updateItemCount();
                    updateTotalPrice();
                },
                error: function (xhr, status, error) {
                    console.error('Error clearing cart:', error);
                }
            });
        });
    });
</script>

