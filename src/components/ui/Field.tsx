import { Check } from "./Icons";

type FieldProps = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "numeric" | "text" | "email" | "tel";
};

/** A text input with a floating label and inline validation. */
export function Field({ name, label, type = "text", required, autoComplete, inputMode }: FieldProps) {
  return (
    <label className="fl" data-fl={name}>
      <input
        name={name}
        type={type}
        placeholder=" "
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
      />
      <span className="lb">{label}</span>
      <i className="bar" />
      <Check />
      <span className="msg" role="alert" />
    </label>
  );
}

export function TextArea({ name, label, max }: { name: string; label: string; max: number }) {
  return (
    <label className="fl" data-fl={name}>
      <textarea name={name} placeholder=" " maxLength={max} />
      <span className="lb">{label}</span>
      <i className="bar" />
      <span className="cnt">0 / {max}</span>
      <span className="msg" role="alert" />
    </label>
  );
}
