export default function Card(props) {
  return (
    <>
      <div className="mx-16 my-5 overflow-hidden rounded-lg shadow-lg bg-slate-100">
        <div className="py-5 text-center">
          <span className="font-bold text-md">{props.quote}</span>
        </div>
      </div>
    </>
  );
}
