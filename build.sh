echo Begin compilation
tsc index.ts --module "commonjs"
echo Execute node
node index