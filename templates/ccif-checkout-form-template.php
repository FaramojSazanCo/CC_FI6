<?php
/**
 * CCIF Iran Checkout - Custom Form Template
 *
 * This template can be overridden by copying it to yourtheme/ccif-iran-checkout/ccif-checkout-form-template.php.
 *
 * @see     https://github.com/your-repo/ccif-iran-checkout
 * @author  Your Name
 * @version 7.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

// The fields are passed into this template as $fields.
// The main checkout object is available as $checkout.
// The order notes field is available as $order_notes.
?>

<div class="ccif-checkout-form">

    <!-- Card 1: Invoice Request -->
    <div id="ccif-invoice-box" class="ccif-box invoice-request-box">
        <h2 class="ccif-invoice-header">
            <?php esc_html_e( 'درخواست صدور فاکتور رسمی', 'ccif-iran-checkout' ); ?>
        </h2>
        <?php
            // Render the invoice request checkbox
            woocommerce_form_field( 'billing_invoice_request', $fields['billing_invoice_request'], $checkout->get_value( 'billing_invoice_request' ) );
        ?>
        <p class="ccif-hint">
            <?php esc_html_e( 'در صورت نیاز به فاکتور رسمی، این گزینه را انتخاب و تمام اطلاعات خریدار را به دقت وارد نمایید. در غیر این صورت، این بخش را نادیده بگیرید.', 'ccif-iran-checkout' ); ?>
        </p>
    </div>

    <!-- Card 2: Person Information -->
    <div id="ccif-person-info-box" class="ccif-box" style="display: none;"> <!-- Initially hidden -->
        <h2 class="ccif-person-info-header">
            <?php esc_html_e( 'اطلاعات شخص', 'ccif-iran-checkout' ); ?>
        </h2>

        <?php
            // Render the person type dropdown
            woocommerce_form_field( 'billing_person_type', $fields['billing_person_type'], $checkout->get_value( 'billing_person_type' ) );
        ?>

        <!-- Real Person Fields -->
        <div id="ccif-real-person-fields" style="display: none;">
            <div class="woocommerce-billing-fields__field-wrapper">
                <?php
                    woocommerce_form_field( 'billing_first_name', $fields['billing_first_name'], $checkout->get_value( 'billing_first_name' ) );
                    woocommerce_form_field( 'billing_last_name', $fields['billing_last_name'], $checkout->get_value( 'billing_last_name' ) );
                    woocommerce_form_field( 'billing_national_code', $fields['billing_national_code'], $checkout->get_value( 'billing_national_code' ) );
                ?>
            </div>
        </div>

        <!-- Legal Person Fields -->
        <div id="ccif-legal-person-fields" style="display: none;">
             <div class="woocommerce-billing-fields__field-wrapper">
                <?php
                    woocommerce_form_field( 'billing_company_name', $fields['billing_company_name'], $checkout->get_value( 'billing_company_name' ) );
                    woocommerce_form_field( 'billing_economic_code', $fields['billing_economic_code'], $checkout->get_value( 'billing_economic_code' ) );
                    woocommerce_form_field( 'billing_agent_first_name', $fields['billing_agent_first_name'], $checkout->get_value( 'billing_agent_first_name' ) );
                    woocommerce_form_field( 'billing_agent_last_name', $fields['billing_agent_last_name'], $checkout->get_value( 'billing_agent_last_name' ) );
                ?>
            </div>
        </div>
    </div>

    <!-- Card 3: Shipping Information -->
    <div class="ccif-box">
        <h2 class="ccif-address-info-header">
            <?php esc_html_e( 'اطلاعات ارسال', 'ccif-iran-checkout' ); ?>
        </h2>
        <div class="woocommerce-billing-fields__field-wrapper">
            <?php
                // Render custom State and City fields
                woocommerce_form_field( 'billing_custom_state', $fields['billing_custom_state'], $checkout->get_value( 'billing_custom_state' ) );
                woocommerce_form_field( 'billing_custom_city', $fields['billing_custom_city'], $checkout->get_value( 'billing_custom_city' ) );

                // Render Address, Postcode, and Phone
                woocommerce_form_field( 'billing_address_1', $fields['billing_address_1'], $checkout->get_value( 'billing_address_1' ) );
                woocommerce_form_field( 'billing_postcode', $fields['billing_postcode'], $checkout->get_value( 'billing_postcode' ) );
                woocommerce_form_field( 'billing_phone', $fields['billing_phone'], $checkout->get_value( 'billing_phone' ) );

                // Render the hidden original fields that WooCommerce uses for shipping calculations.
                // Our JS will sync the values from our custom fields to these.
                echo '<div class="ccif-hidden-field">';
                woocommerce_form_field( 'billing_state', $fields['billing_state'], $checkout->get_value( 'billing_state' ) );
                woocommerce_form_field( 'billing_city', $fields['billing_city'], $checkout->get_value( 'billing_city' ) );
                echo '</div>';
            ?>
        </div>
    </div>

    <!-- Card 4: Additional Notes -->
    <div class="ccif-box">
        <h2 class="ccif-order-notes-header">
            <?php esc_html_e( 'توضیحات تکمیلی', 'ccif-iran-checkout' ); ?>
        </h2>
        <div class="woocommerce-order-notes__field-wrapper">
             <?php
                // Render the order notes field
                woocommerce_form_field( 'order_comments', $order_notes, $checkout->get_value( 'order_comments' ) );
            ?>
        </div>
    </div>

</div>
