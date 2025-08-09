jQuery(function($) {
    'use
strict';

    // Ensure we are on the checkout page and the required elements exist
    if (!$('body').hasClass('woocommerce-checkout') || $('#customer_details').length === 0) {
        return;
    }

    // --- 1. Create the Card Layout Structure ---

    function createCardLayout() {
        var form = $('form.checkout .col2-set'); // A reliable parent element
        if (!form.length) return;

        // Inject the card containers at the top of the form
        form.prepend(`
            <div id="ccif-custom-cards-wrapper">
                <!-- Card 1: Invoice Request -->
                <div id="ccif-invoice-box" class="ccif-box invoice-request-box">
                    <h2 class="ccif-invoice-header">درخواست صدور فاکتور رسمی</h2>
                    <p class="ccif-hint">در صورت نیاز به فاکتور رسمی، این گزینه را انتخاب و تمام اطلاعات خریدار را به دقت وارد نمایید.</p>
                </div>

                <!-- Card 2: Person Information -->
                <div id="ccif-person-info-box" class="ccif-box" style="display: none;">
                    <h2 class="ccif-person-info-header">اطلاعات شخص</h2>
                    <div id="ccif-real-person-fields" style="display: none;"></div>
                    <div id="ccif-legal-person-fields" style="display: none;"></div>
                </div>

                <!-- Card 3: Shipping Information -->
                <div id="ccif-address-box" class="ccif-box">
                    <h2 class="ccif-address-info-header">اطلاعات ارسال</h2>
                </div>

                <!-- Card 4: Additional Notes -->
                <div id="ccif-notes-box" class="ccif-box">
                    <h2 class="ccif-order-notes-header">توضیحات تکمیلی</h2>
                </div>
            </div>
        `);
    }


    // --- 2. Move Existing Fields into the New Card Structure ---

    function moveFieldsToCards() {
        // Card 1: Invoice
        $('#billing_invoice_request_field').appendTo('#ccif-invoice-box');

        // Card 2: Person Info
        $('#billing_person_type_field').appendTo('#ccif-person-info-box');

        // Real Person Sub-section
        $('#billing_first_name_field').appendTo('#ccif-real-person-fields');
        $('#billing_last_name_field').appendTo('#ccif-real-person-fields');
        $('#billing_national_code_field').appendTo('#ccif-real-person-fields');

        // Legal Person Sub-section
        $('#billing_company_name_field').appendTo('#ccif-legal-person-fields');
        $('#billing_economic_code_field').appendTo('#ccif-legal-person-fields');
        $('#billing_agent_first_name_field').appendTo('#ccif-legal-person-fields');
        $('#billing_agent_last_name_field').appendTo('#ccif-legal-person-fields');

        // Card 3: Shipping
        $('#billing_custom_state_field').appendTo('#ccif-address-box');
        $('#billing_custom_city_field').appendTo('#ccif-address-box');
        $('#billing_address_1_field').appendTo('#ccif-address-box');
        $('#billing_postcode_field').appendTo('#ccif-address-box');
        $('#billing_phone_field').appendTo('#ccif-address-box');

        // Move the hidden fields too, to keep them with their group
        $('.ccif-hidden-field').appendTo('#ccif-address-box');

        // Card 4: Notes
        $('#order_comments_field').appendTo('#ccif-notes-box');
    }

    // --- 3. Attach Event Handlers and Logic ---

    function initFieldLogic() {
        // --- Cache jQuery selectors for performance ---
        var $invoiceCheckbox = $('#billing_invoice_request');
        var $personInfoBox = $('#ccif-person-info-box');
        var $personTypeSelect = $('#billing_person_type');
        var $realPersonFields = $('#ccif-real-person-fields');
        var $legalPersonFields = $('#ccif-legal-person-fields');
        var $customStateSelect = $('#billing_custom_state');
        var $customCitySelect = $('#billing_custom_city');
        var $hiddenStateField = $('#billing_state');
        var $hiddenCityField = $('#billing_city');

        var cities = (typeof ccifData !== 'undefined' && ccifData.cities) ? ccifData.cities : null;
        if (!cities) {
             console.error('CCIF Iran Checkout: City data is not available.');
        }

        /**
         * Toggles the requirement status of fields.
         */
        function setFieldsRequirement(container, isRequired) {
            var $fieldsToToggle = container.find('.form-row');
            $fieldsToToggle.each(function() {
                var $fieldRow = $(this);
                // Only make required fields that are not already required by default (like address)
                if (!$fieldRow.hasClass('validate-required')) {
                     if (isRequired) {
                        $fieldRow.addClass('ccif-is-required');
                    } else {
                        $fieldRow.removeClass('ccif-is-required');
                    }
                }
            });
        }

        /**
         * Handles the visibility and requirement logic for the invoice-related fields.
         */
        function handleInvoiceBox() {
            var isInvoiceRequested = $invoiceCheckbox.is(':checked');
            if (isInvoiceRequested) {
                $personInfoBox.slideDown(350);
                setFieldsRequirement($personInfoBox, true);
            } else {
                $personInfoBox.slideUp(250);
                setFieldsRequirement($personInfoBox, false);
            }
            togglePersonFields();
        }

        /**
         * Toggles visibility of real vs. legal person fields.
         */
        function togglePersonFields() {
            var personType = $personTypeSelect.val();
            if (personType === 'real') {
                $legalPersonFields.slideUp(250, function() {
                    setFieldsRequirement($legalPersonFields, false);
                });
                $realPersonFields.slideDown(350, function() {
                    setFieldsRequirement($realPersonFields, true);
                });
            } else if (personType === 'legal') {
                $realPersonFields.slideUp(250, function() {
                    setFieldsRequirement($realPersonFields, false);
                });
                $legalPersonFields.slideDown(350, function() {
                    setFieldsRequirement($legalPersonFields, true);
                });
            } else {
                $realPersonFields.slideUp(250);
                $legalPersonFields.slideUp(250);
                 setFieldsRequirement($realPersonFields, false);
                 setFieldsRequirement($legalPersonFields, false);
            }
        }

        /**
         * Populates the custom city dropdown.
         */
        function populateCustomCities() {
            if (!cities) return;
            var stateCode = $customStateSelect.val();
            var originalCityVal = $hiddenCityField.val();

            $customCitySelect.empty().append($('<option>', { value: '', text: 'ابتدا استان را انتخاب کنید' }));

            if (stateCode && cities[stateCode]) {
                $.each(cities[stateCode], function(index, cityName) {
                    $customCitySelect.append($('<option>', {
                        value: cityName,
                        text: cityName,
                        selected: cityName === originalCityVal
                    }));
                });
                $customCitySelect.val(originalCityVal);
            }
            $customCitySelect.trigger('change');
        }

        // --- Attach Event Handlers ---
        $invoiceCheckbox.on('change', handleInvoiceBox);
        $personTypeSelect.on('change', togglePersonFields);
        $customStateSelect.on('change', function() {
            var selectedState = $(this).val();
            $hiddenStateField.val(selectedState).trigger('change');
            populateCustomCities();
        });
        $customCitySelect.on('change', function() {
            var selectedCity = $(this).val();
            $hiddenCityField.val(selectedCity).trigger('change');
        });

        // --- Initial Page Load Logic ---
        handleInvoiceBox();
        $customStateSelect.val($hiddenStateField.val());
        populateCustomCities();
    }


    // --- Run Everything ---
    createCardLayout();
    moveFieldsToCards();
    initFieldLogic();

});
