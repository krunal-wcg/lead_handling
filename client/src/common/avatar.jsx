import clsx from "clsx";

// React component for displaying an avatar
export const Avatar = ({ name, className }) => {
  const { color, character } = RandomColorGenerator(name);

  return (
    <span style={{ backgroundColor: color }} className={clsx(className)}>
      {character}
    </span>
  );
};

export const Tag = ({ name, className }) => {
  const { color } = RandomColorGenerator(name);

  return (
    <span style={{ backgroundColor: color }} className={clsx(className)}>
      {name}
    </span>
  );
};

export const RandomColorGenerator = (name) => {
  var nameArray = name;
  var colorNum;

  if (name?.toLowerCase()?.split(" ")?.length > 1 && name?.includes(" ")) {
    nameArray = name?.toLowerCase()?.split(" ");
    colorNum =
      nameArray[1]?.charCodeAt(2)?.toString() +
      nameArray[1]?.charCodeAt(0)?.toString() +
      nameArray[0]?.charCodeAt(1)?.toString();
  } else {
    // get the ASCII code of the character
    // number that contains 3 times ASCII value of character -- unique for every alphabet
    colorNum =
      nameArray?.charCodeAt(1)?.toString() +
      nameArray?.charCodeAt(0)?.toString() +
      nameArray?.charCodeAt(0)?.toString();
  }

  var num = Math.round(0xfffaaf * parseInt(colorNum));
  var r = (num >> 11) & 235;
  var g = (num >> 5) & 255;
  var b = num & 255;

  return {
    color: "rgb(" + r + ", " + g + ", " + b + ", 0.8)",
    character: nameArray[0][0]?.toUpperCase() + nameArray[1][0]?.toUpperCase(),
  };
};
