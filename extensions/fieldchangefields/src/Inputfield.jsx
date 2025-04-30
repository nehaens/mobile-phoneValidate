// import {
//   reactExtension,
//   View,
//   TextField,
//   useApplyAttributeChange,
//   useBuyerJourneyIntercept,
//   useEmail,
//   useCustomer,
// } from '@shopify/ui-extensions-react/checkout';
// import {useState} from 'react';

// export default reactExtension(
//   'purchase.checkout.delivery-address.render-before',
//   () => <Extension />,
// );

// function Extension() {
//   const applyAttributeChange = useApplyAttributeChange();
//   const [value, setValue] = useState('');
//   const [error, setError] = useState(undefined);
 
//   const customerLogin = useCustomer()

//   if (customerLogin?.email) {
//     return null;
//   }
//   useBuyerJourneyIntercept(({canBlockProgress}) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!value || !emailRegex.test(value)) {
//       setError('Please enter a valid email address');
//       return {
//         behavior: 'block',
//         reason: 'Invalid or empty email',
//         // errors: [
//         //   {
//         //     message: 'Email is required and must be valid.',
//         //   },
//         // ],
//       };
//     }

//     setError(undefined);

//     return {
//       behavior: 'allow',
//     };
//   });

//   const handleInputChange = async (newValue) => {
//     setValue(newValue);

//     await applyAttributeChange({
//       type: 'updateAttribute',
//       key: 'custom_email',
//       value: newValue,
//     });
//   };

//   return (
//     <View>
//       <TextField
//         label="Enter your email"
//         name="custom_email"
//         value={value}
//         onChange={handleInputChange}
//         error={error}
//         required
//       />
//     </View>
//   );
// }

import {
  reactExtension,
  View,
  TextField,
  useApplyAttributeChange,
  useBuyerJourneyIntercept,
  usePhone,
  useEmail,
  useCustomer,
} from "@shopify/ui-extensions-react/checkout";
import { useState } from "react";
 
export default reactExtension(
  "purchase.checkout.delivery-address.render-before",
  () => <Extension />
);
 
function Extension() {
  const applyAttributeChange = useApplyAttributeChange();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const email = useEmail();
  const phone = usePhone();
  const customerLogin = useCustomer()
  if (customerLogin?.email) {
        return null;
      }
 console.log("mmmm")
  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:\+91)?[6-9]\d{9}$/;
    return phone === undefined
      ? {
          behavior: "block",
          reason: "Email is required",
          errors: [
            {
              message: "Please enter phone number",
              target: "$.cart.buyerIdentity.email",
            },
            {
              message: "Please enter phone number",
              target: "$.cart.buyerIdentity.phone",
            },
          ],
        }
      : phone !== undefined && phoneRegex.test(phone) === false
      ? {
          behavior: "block",
          reason: "Invalid phone number",
          errors: [
            {
              message: "Please enter a valid phone number",
              target: "$.cart.buyerIdentity.email",
            },
            {
              message: "Please enter a valid phone number",
              target: "$.cart.buyerIdentity.phone",
            },
          ],
        }
      : email === undefined && phone === undefined
      ? {
          behavior: "block",
          reason: "Email is required",
          errors: [
            {
              message: "Please enter phone number",
              target: "$.cart.buyerIdentity.email",
            },
            {
              message: "Please enter phone number",
              target: "$.cart.buyerIdentity.phone",
            },
          ],
        }
      : email !== undefined
      ? {
          behavior: "block",
          reason: "Email is required",
          errors: [
            {
              message: "Please enter phone number",
              target: "$.cart.buyerIdentity.email",
            },
            {
              message: "Please enter phone number",
              target: "$.cart.buyerIdentity.phone",
            },
          ],
        }
      : value === ""
      ? {
          behavior: "block",
          reason: "Email is required",
          perform: (result) => {
            if (result.behavior === "block") {
              setError("Email is required");
            }
          },
        }
      : emailRegex.test(value) === false
      ? {
          behavior: "block",
          reason: "Invalid or empty email",
          perform: (result) => {
            if (result.behavior === "block") {
              setError("Please enter a valid email address");
            }
          },
        }
      : {
          behavior: "allow",
          perform: (result) => {
            if (result.behavior === "allow") {
              setError("");
            }
          },
        };
  });
 
  const handleInputChange = async (newValue) => {
    setValue(newValue);
    await applyAttributeChange({
      type: "updateAttribute",
      key: "custom_email",
      value: newValue,
    });
  };
 
  return (
    <View>
      <TextField
        label="Enter your email"
        name="custom_email"
        value={value}
        onChange={(e) => {
          handleInputChange(e);
        }}
        onInput={(e) => {
          setError("");
        }}
        error={error}
        required
      />
    </View>
  );
}
  