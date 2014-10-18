jQuery(function($) {
  jQuery('[data-numeric]').payment('restrictNumeric');
  jQuery('.cc-number').payment('formatCardNumber');
  // jQuery('.cc-exp').payment('formatCardExpiry');
  jQuery('.cc-cvc').payment('formatCardCVC');

  $.fn.toggleInputError = function(erred) {
    this.parent('.form-group').toggleClass('has-error', erred);
    return this;
  };

  jQuery('#signup-form').submit(function(e) {
    e.preventDefault();

    var cardType = $.payment.cardType($('.cc-number').val());
    $('.cc-number').toggleInputError(!$.payment.validateCardNumber($('.cc-number').val()));
    // $('.cc-exp').toggleInputError(!$.payment.validateCardExpiry($('.cc-exp').payment('cardExpiryVal')));
    $('.cc-cvc').toggleInputError(!$.payment.validateCardCVC($('.cc-cvc').val(), cardType));
    $('.cc-brand').text(cardType);

    $('.validation').removeClass('text-danger text-success');
    $('.validation').addClass($('.has-error').length ? 'text-danger' : 'text-success');
  });
  jQuery('#signup-form').submit(function(e) {
    var $form = $(this);
    $form.find('#payment-errors').text('').hide();

    // Disable the submit button to prevent repeated clicks
    $form.find('button').prop('disabled', true);

    Stripe.card.createToken($form, stripeResponseHandler);

    // Prevent the form from submitting with the default action
    return false;
  });
});

 
var stripeResponseHandler = function(status, response) {
  var $form = jQuery('#signup-form');

  if (response.error) {
    // Show the errors on the form
    $form.find('#payment-errors').text(response.error.message).show();
    $form.find('button').prop('disabled', false);
  } else {
    // token contains id, last4, and card type
    var token = response.id;
    // Insert the token into the form so it gets submitted to the server
    $form.append(jQuery('<input type="hidden" name="stripeToken" />').val(token));
    // and re-submit
    $form.get(0).submit();
  }
};
