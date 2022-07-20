import { ComponentType, useEffect } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
};

export const withValidate = <P extends object>(Component: ComponentType<P>) => {
  return (props: P & Props) => {
    // const { control } = useForm();
    const {
      getValues,
      setValue,
      register,
      control,
      setError,
      formState: { errors },
    } = useFormContext();
    const { name } = props;

    useEffect(() => {
      // console.log("with validate error", errors);
    }, [errors]);

    return (
      <Component
        {...(props as P)}
        control={control}
        register={register}
        getValues={getValues}
        setValue={setValue}
        setError={setError}
        errors={errors}
      />
    );
  };
};
