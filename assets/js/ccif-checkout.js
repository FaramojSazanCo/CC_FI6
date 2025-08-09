jQuery(function($) {
    'use strict';

    // --- City/State Synchronization Logic (Preserved from original) ---
    if (typeof ccifData === 'undefined' || !ccifData.cities) {
        console.error('CCIF Iran Checkout: City data is not available.');
        return;
    }
    var cities = ccifData.cities;

    function populateCustomCities() {
        var state = $('#billing_custom_state').val();
        var $cityField = $('#billing_custom_city');
        // Get value from original hidden field to maintain it on reloads
        var originalCityVal = $('#billing_city').val();

        $cityField.empty().append('<option value="">ابتدا استان را انتخاب کنید</option>');

        if (state && cities[state]) {
            $.each(cities[state], function(index, cityName) {
                $cityField.append($('<option>', {
                    value: cityName,
                    text: cityName,
                    // Reselect the city if it was already selected
                    selected: cityName === originalCityVal
                }));
            });
        }
        // After populating, ensure the custom city's value is synced to the original
        $cityField.trigger('change');
    }

    $('body').on('change', '#billing_custom_state', function() {
        var selectedState = $(this).val();
        $('#billing_state').val(selectedState).trigger('change'); // Update and trigger WC's logic
        populateCustomCities();
    });

    $('body').on('change', '#billing_custom_city', function() {
        var selectedCity = $(this).val();
        $('#billing_city').val(selectedCity).trigger('change'); // Update and trigger WC's logic
    });

    // --- New Conditional Field Logic ---

    const invoiceFieldSelectors = {
        personType: '#billing_person_type',
        real: [
            '#billing_first_name',
            '#billing_last_name',
            '#billing_national_code'
        ],
        legal: [
            '#billing_company_name',
            '#billing_economic_code',
            '#billing_agent_first_name',
            '#billing_agent_last_name'
        ]
    };

    /**
     * A helper function to add or remove 'required' status from a set of fields.
     * @param {string[]} selectors - Array of jQuery selectors for the input fields.
     * @param {boolean} required - True to make fields required, false to make them optional.
     */
    const setFieldsRequired = (selectors, required) => {
        $(selectors.join(', ')).each(function() {
            const $input = $(this);
            const $formRow = $input.closest('.form-row');
            if (required) {
                // Add classes for our custom CSS indicator and for WooCommerce's own validation.
                $formRow.addClass('ccif-is-required validate-required');
                $input.prop('required', true);
            } else {
                $formRow.removeClass('ccif-is-required validate-required');
                $input.prop('required', false);
            }
        });
    };

    /**
     * Toggles visibility of fields for "Individual" (حقیقی) vs "Legal" (حقوقی) persons.
     * Also sets the required status based on the person type AND whether the invoice is requested.
     */
    function togglePersonFields() {
        const personType = $(invoiceFieldSelectors.personType).val();
        const $realPersonWrapper = $('.ccif-real-person-fields-wrapper');
        const $legalPersonWrapper = $('.ccif-legal-person-fields-wrapper');
        const isInvoiceRequested = $('#billing_invoice_request').is(':checked');

        if (personType === 'real') {
            $legalPersonWrapper.slideUp(250);
            $realPersonWrapper.slideDown(350);
            if (isInvoiceRequested) {
                setFieldsRequired(invoiceFieldSelectors.legal, false);
                setFieldsRequired(invoiceFieldSelectors.real, true);
            }
        } else if (personType === 'legal') {
            $realPersonWrapper.slideUp(250);
            $legalPersonWrapper.slideDown(350);
            if (isInvoiceRequested) {
                setFieldsRequired(invoiceFieldSelectors.real, false);
                setFieldsRequired(invoiceFieldSelectors.legal, true);
            }
        } else {
            $realPersonWrapper.slideUp(250);
            $legalPersonWrapper.slideUp(250);
            // If no person type is selected, none of the sub-fields are required.
            setFieldsRequired(invoiceFieldSelectors.real, false);
            setFieldsRequired(invoiceFieldSelectors.legal, false);
        }
    }

    /**
     * Toggles the entire "Buyer Information" section based on the invoice request checkbox.
     */
    function toggleInvoiceSection() {
        const $invoiceBox = $('.ccif-buyer-info-wrapper');
        const isChecked = $('#billing_invoice_request').is(':checked');
        const personTypeSelector = [invoiceFieldSelectors.personType];

        if (isChecked) {
            $invoiceBox.slideDown(350);
            // "Person Type" dropdown is now required.
            setFieldsRequired(personTypeSelector, true);
            // Re-evaluate which sub-fields (real/legal) should be shown/required.
            togglePersonFields();
        } else {
            $invoiceBox.slideUp(250);
            // If the whole box is hidden, nothing inside is required.
            setFieldsRequired(personTypeSelector, false);
            setFieldsRequired(invoiceFieldSelectors.real, false);
            setFieldsRequired(invoiceFieldSelectors.legal, false);
            // Also explicitly hide the sub-wrappers.
            $('.ccif-real-person-fields-wrapper, .ccif-legal-person-fields-wrapper').hide();
        }
    }

    // --- Event Handlers ---
    $('body').on('change', '#billing_person_type', togglePersonFields);
    $('body').on('change', '#billing_invoice_request', toggleInvoiceSection);

    // --- Initial Page Load Logic ---
    // Sync state/city dropdowns on load (in case of a validation error reload)
    if ($('#billing_state').val()) {
        $('#billing_custom_state').val($('#billing_state').val());
    }
    populateCustomCities(); // Populate cities on initial load

    // Set the initial state for the invoice section and person fields.
    toggleInvoiceSection();
});
