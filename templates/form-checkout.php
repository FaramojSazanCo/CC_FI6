<?php
/**
 * Custom Checkout Form
 *
 * This template overrides the default WooCommerce checkout form to implement a custom layout.
 * It creates a single-column layout with custom-styled boxes for a modern feel.
 *
 * @see https://docs.woocommerce.com/document/template-structure/
 * @version 7.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Print any notices we might have.
wc_print_notices();

do_action( 'woocommerce_before_checkout_form', $checkout );

// If checkout registration is disabled and the user is not logged in, they can't checkout.
if ( ! $checkout->is_registration_enabled() && $checkout->is_registration_required() && ! is_user_logged_in() ) {
	echo esc_html( apply_filters( 'woocommerce_checkout_must_be_logged_in_message', __( 'You must be logged in to checkout.', 'woocommerce' ) ) );
	return;
}

?>

<form name="checkout" method="post" class="checkout woocommerce-checkout" action="<?php echo esc_url( wc_get_checkout_url() ); ?>" enctype="multipart/form-data">

	<div class="ccif-custom-layout">
		<div class="ccif-customer-details">
			<?php
			/**
			 * CCIF Custom Layout Begins
			 * We are creating a custom layout with boxes and rendering fields manually.
			 */
			$fields = $checkout->get_checkout_fields();
			?>

			<div class="ccif-checkout-form">

				<?php // --- Box 1: Invoice Request --- ?>
				<div id="ccif-invoice-request-box" class="ccif-box invoice-request-box">
                    <h2>درخواست فاکتور رسمی</h2>
					<?php
						woocommerce_form_field( 'billing_invoice_request', $fields['billing']['billing_invoice_request'], $checkout->get_value( 'billing_invoice_request' ) );
					?>
					<p class="ccif-hint">در صورت نیاز به ارائه فاکتور رسمی، این گزینه را انتخاب کنید.</p>
				</div>

				<?php // --- Box 2: Buyer Information --- ?>
				<div class="ccif-box ccif-buyer-info-wrapper" data-person-fields-wrapper>
					<h2 class="ccif-person-info-header">اطلاعات خریدار</h2>
					<?php
						woocommerce_form_field( 'billing_person_type', $fields['billing']['billing_person_type'], $checkout->get_value( 'billing_person_type' ) );
					?>

					<div class="ccif-real-person-fields-wrapper" style="display: none;">
						<div class="woocommerce-billing-fields__field-wrapper">
							<?php
								woocommerce_form_field( 'billing_first_name', $fields['billing']['billing_first_name'], $checkout->get_value( 'billing_first_name' ) );
								woocommerce_form_field( 'billing_last_name', $fields['billing']['billing_last_name'], $checkout->get_value( 'billing_last_name' ) );
								woocommerce_form_field( 'billing_national_code', $fields['billing']['billing_national_code'], $checkout->get_value( 'billing_national_code' ) );
							?>
						</div>
					</div>

					<div class="ccif-legal-person-fields-wrapper" style="display: none;">
						 <div class="woocommerce-billing-fields__field-wrapper">
							<?php
								woocommerce_form_field( 'billing_company_name', $fields['billing']['billing_company_name'], $checkout->get_value( 'billing_company_name' ) );
								woocommerce_form_field( 'billing_economic_code', $fields['billing']['billing_economic_code'], $checkout->get_value( 'billing_economic_code' ) );
								woocommerce_form_field( 'billing_agent_first_name', $fields['billing']['billing_agent_first_name'], $checkout->get_value( 'billing_agent_first_name' ) );
								woocommerce_form_field( 'billing_agent_last_name', $fields['billing']['billing_agent_last_name'], $checkout->get_value( 'billing_agent_last_name' ) );
							?>
						</div>
					</div>
				</div>

				<?php // --- Box 3: Shipping Information --- ?>
				<div class="ccif-box">
					<h2 class="ccif-address-info-header">اطلاعات ارسال</h2>
					<div class="woocommerce-billing-fields__field-wrapper">
						<?php
							woocommerce_form_field( 'billing_custom_state', $fields['billing']['billing_custom_state'], $checkout->get_value( 'billing_custom_state' ) );
							woocommerce_form_field( 'billing_custom_city', $fields['billing']['billing_custom_city'], $checkout->get_value( 'billing_custom_city' ) );
							woocommerce_form_field( 'billing_address_1', $fields['billing']['billing_address_1'], $checkout->get_value( 'billing_address_1' ) );
							woocommerce_form_field( 'billing_postcode', $fields['billing']['billing_postcode'], $checkout->get_value( 'billing_postcode' ) );
							woocommerce_form_field( 'billing_phone', $fields['billing']['billing_phone'], $checkout->get_value( 'billing_phone' ) );
						?>
					</div>
				</div>

				<?php // --- Box 4: Additional Notes --- ?>
				<div class="ccif-box">
					<h2 class="ccif-order-notes-header">توضیحات تکمیلی</h2>
					<div class="woocommerce-additional-fields__field-wrapper">
						<?php
							foreach ( $fields['order'] as $key => $field ) {
								woocommerce_form_field( $key, $field, $checkout->get_value( $key ) );
							}
						?>
					</div>
				</div>
			</div>

			<?php
			// Render hidden original fields for synchronization with our custom fields
			echo '<div class="ccif-hidden-field">';
			woocommerce_form_field( 'billing_state', $fields['billing']['billing_state'], $checkout->get_value( 'billing_state' ) );
			woocommerce_form_field( 'billing_city', $fields['billing']['billing_city'], $checkout->get_value( 'billing_city' ) );
			echo '</div>';
			?>
		</div>

		<div class="ccif-order-review">
			<h3 id="order_review_heading"><?php esc_html_e( 'Your order', 'woocommerce' ); ?></h3>

			<?php do_action( 'woocommerce_checkout_before_order_review' ); ?>

			<div id="order_review" class="woocommerce-checkout-review-order">
				<?php do_action( 'woocommerce_checkout_order_review' ); ?>
			</div>

			<?php do_action( 'woocommerce_checkout_after_order_review' ); ?>
		</div>
	</div>

</form>

<?php do_action( 'woocommerce_after_checkout_form', $checkout ); ?>
