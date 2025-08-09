jQuery(function($) {
    'use strict';

    // Ensure ccifData and cities are available
    if (typeof ccifData === 'undefined' || !ccifData.cities) {
        console.error('CCIF Iran Checkout: City data is not available.');
        return;
    }
    var cities = ccifData.cities;

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

    /**
     * Toggles the requirement status of fields within the person info box.
     * @param {boolean} isRequired - Whether the fields should be mandatory.
     */
    function setFieldsRequirement(isRequired) {
        // Find all form-rows within the person info box, excluding the person type dropdown itself.
        var $fieldsToToggle = $personInfoBox.find('.form-row').not('.validate-required');

        $fieldsToToggle.each(function() {
            var $fieldRow = $(this);
            var $input = $fieldRow.find('input, select');

            if (isRequired) {
                $fieldRow.addClass('ccif-is-required validate-required').removeClass('woocommerce-validated');
                $input.prop('required', true);
            } else {
                $fieldRow.removeClass('ccif-is-required validate-required');
                $input.prop('required', false);
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
            setFieldsRequirement(true);
        } else {
            $personInfoBox.slideUp(250);
            setFieldsRequirement(false);
        }
        // After showing/hiding, also trigger the person type toggle
        // to ensure the correct sub-fields (real/legal) are shown.
        togglePersonFields();
    }

    /**
     * Toggles visibility of real vs. legal person fields based on dropdown selection.
     */
    function togglePersonFields() {
        var personType = $personTypeSelect.val();

        if (personType === 'real') {
            $legalPersonFields.slideUp(250);
            $realPersonFields.slideDown(350);
        } else if (personType === 'legal') {
            $realPersonFields.slideUp(250);
            $legalPersonFields.slideDown(350);
        } else {
            $realPersonFields.slideUp(250);
            $legalPersonFields.slideUp(250);
        }
    }

    /**
     * Populates the custom city dropdown based on the selected state.
     */
    function populateCustomCities() {
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
             // After populating, ensure the custom city's value is what it should be
            $customCitySelect.val(originalCityVal);
        }

        $customCitySelect.trigger('change');
    }

    // --- Event Handlers ---

    // 1. Invoice request checkbox
    $invoiceCheckbox.on('change', handleInvoiceBox);

    // 2. Person type dropdown
    $personTypeSelect.on('change', togglePersonFields);

    // 3. Custom state dropdown (for populating cities)
    $customStateSelect.on('change', function() {
        var selectedState = $(this).val();
        $hiddenStateField.val(selectedState).trigger('change');
        populateCustomCities();
    });

    // 4. Custom city dropdown (for syncing to hidden field)
    $customCitySelect.on('change', function() {
        var selectedCity = $(this).val();
        $hiddenCityField.val(selectedCity).trigger('change');
    });

    // --- Initial Page Load Logic ---

    // 1. Set initial state for the invoice box and person fields.
    // This ensures that if the page reloads with errors, the form state is correct.
    handleInvoiceBox();

    // 2. Populate cities based on the initial state value.
    // Set custom state value from the original hidden field (in case of validation error reload)
    $customStateSelect.val($hiddenStateField.val());
    populateCustomCities();
});
