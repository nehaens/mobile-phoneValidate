import {
  reactExtension,
  useShippingAddress,
  useBuyerJourneyIntercept,
  useEmail,
  usePhone,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const tgt_shipping = useShippingAddress()
console.log(tgt_shipping,"tgt_shipping>>>>")
  const email = useEmail();
  const phone = usePhone();

    
const emailValue = email;
const phoneValue = phone ;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if(phoneValue !== undefined)
{
  let phoneValueLength = phoneValue.length;
  let nameRegex = /^(?:\+91)?[6-9]\d{9}$/;
  console.log("you have enter email")
  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    return (phoneValueLength === 0 && nameRegex.test(phoneValue) === true) ||
      (phoneValueLength === 0 && nameRegex.test(phoneValue) === false) ||
      (phoneValueLength !== 0 && nameRegex.test(phoneValue) === false)
      ? {
          behavior: "block",
          reason: "Invalid phone number",
          errors: [
            {
              message: "Please enter a valid 10-digit phone number (starting with 6-9)",
              target: "$.cart.buyerIdentity.email",
            },
            {
              message: "Please enter a valid 10-digit phone number (starting with 6-9)",
              target: "$.cart.buyerIdentity.phone",
            },
          ],
        }
      : {
          behavior: "allow",
        };
  });

}
else if(phoneValue === undefined)
{
  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    return {
      behavior: "block",
      reason: "User name not filled",
      errors: [
        {
          message: "Please enter a valid 10-digit phone number (starting with 6-9)",
          target: "$.cart.buyerIdentity.email",
        },
        {
          message: "Please enter a valid 10-digit phone number (starting with 6-9)",
          target: "$.cart.buyerIdentity.phone",
        },
        // {
        //   message: "Please enter valid Phone number",
        // },
      ],
    }
  });
}

  return null;
}
