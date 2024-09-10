type FormValidations = {
  required?: boolean;
};

export function formValidations(settings: FormValidations) {
  const { required } = settings;
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
    return undefined;
  };
}
