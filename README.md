# rspack-memory-leak

## Run

```bash
pnpm install
pnpm run start
```

## Now

```
done {}
try
gc:  foo
end
```

## Expected

```
done {}
try
gc:  foo
gc:  compiler
end
```
