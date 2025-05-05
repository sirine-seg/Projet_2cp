import FieldContainer from "../components/fieldContainer";

export default function FieldGrid({ fields = [], onFieldClick }) {
  return (
    <div className="w-full flex flex-wrap gap-2">
      {fields.map((field, index) => (
        <FieldContainer 
          key={index}
          field={field}
          onClick={() => onFieldClick(field)}
        />
      ))}
    </div>
  );
}

