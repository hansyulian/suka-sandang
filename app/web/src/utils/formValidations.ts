import { isEmail } from "@hyulian/common";

type FormValidations = {
  required?: boolean;
  email?: boolean;
};

export function formValidations(settings: FormValidations) {
  const { required, email } = settings;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (value: any) => {
    if (
      required &&
      (value === undefined ||
        value === null ||
        value === "" ||
        value.length === 0)
    ) {
      return "Required";
    }
    if (email && value && !isEmail(value)) {
      return "Invalid Email";
    }
    return undefined;
  };
}
