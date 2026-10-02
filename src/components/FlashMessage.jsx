export default function FlashMessage({ flash, className = "message" }) {
  return (
    <p className={`${className} ${flash ? flash.type : ""}`} role="status" aria-live="polite">
      {flash ? flash.text : ""}
    </p>
  );
}
