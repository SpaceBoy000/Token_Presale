const Button = ({ text, disable, onClick }) => {
  return (
    <button
      className={`relative bg-btngrad rounded-lg bg-cover bg-center bg-no-repeat text-white text-2xl w-full 
      ${disable === "true" ? "opacity-25" : "opacity-100"
        }`}
      onClick={() => {
        if (disable === "true")
          return;
        onClick();
      }}
    >
      {text}
    </button>
  );
};

export default Button;
