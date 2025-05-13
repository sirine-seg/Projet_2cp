import FieldBigContainer from "./fieldBigContainer";

export default function FieldLines({
  fields = [],
  onSubfieldClick,
  onClickAdd,
  onClickDelete,
}) {
  return (
    <div className="w-full flex flex-col mt-2 gap-x-2 gap-y-2">
      {fields.map((fieldObj, index) => (
        <FieldBigContainer
          key={index}
          field={fieldObj.title}
          subfields={fieldObj.subfields}
          onSubfieldClick={(subfieldName) =>
            onSubfieldClick(subfieldName, fieldObj.id)
          }
          onClickAdd={() => onClickAdd(fieldObj.title)}
          onClickDelete={() => onClickDelete(fieldObj.title)}
        />
      ))}
    </div>
  );
}