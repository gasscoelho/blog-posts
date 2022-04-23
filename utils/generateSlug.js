function getArgs() {
  return process.argv.slice(2);
}

function isArgsInformed() {
  return getArgs().length !== 0;
}

function generateSlug() {
  const args = getArgs();

  if (!isArgsInformed()) {
    throw Error("The title argument must be passed.");
  }

  const slug = args[0].replaceAll(" ", "-").toLowerCase();
  
  console.log(slug);
}

generateSlug();
