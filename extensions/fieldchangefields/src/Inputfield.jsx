import {
  reactExtension,
  View,
  TextField,
  useApplyAttributeChange,
  useBuyerJourneyIntercept,
} from '@shopify/ui-extensions-react/checkout';
import {useState} from 'react';

export default reactExtension(
  'purchase.checkout.delivery-address.render-before',
  () => <Extension />,
);

function Extension() {
  const applyAttributeChange = useApplyAttributeChange();
  const [value, setValue] = useState('');
  const [error, setError] = useState(undefined);

  useBuyerJourneyIntercept(({canBlockProgress}) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value || !emailRegex.test(value)) {
      setError('Please enter a valid email address');
      return {
        behavior: 'block',
        reason: 'Invalid or empty email',
        // errors: [
        //   {
        //     message: 'Email is required and must be valid.',
        //   },
        // ],
      };
    }

    setError(undefined);

    return {
      behavior: 'allow',
    };
  });

  const handleInputChange = async (newValue) => {
    setValue(newValue);

    await applyAttributeChange({
      type: 'updateAttribute',
      key: 'custom_email',
      value: newValue,
    });
  };

  return (
    <View>
      <TextField
        label="Enter your email"
        name="custom_email"
        value={value}
        onChange={handleInputChange}
        error={error}
        required
      />
    </View>
  );
}

  