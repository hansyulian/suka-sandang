import { isEmail } from "@hyulian/common";

type FormValidations = {
  required?: boolean;
  email?: boolean;
  max?: number;
};

export function formValidations(settings: FormValidations) {
  const { required, email, max } = settings;
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
    if (required && typeof value === "number" && value === 0) {
      return "Required";
    }
    if (typeof value === "number" && max && value > max) {
      return "Invalid Value";
    }
    if (email && value && !isEmail(value)) {
      return "Invalid Email";
    }
    return undefined;
  };
}
