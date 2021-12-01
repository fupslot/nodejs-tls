### Simple TLS Server on NodeJS for testing purposes
---

### Getting Started

```bash
# Init config 
make init

# generate self-signed sertificates
make certs

# start server
yarn debug
```

You can use `openssl s_client` to test the connection

```bash
openssl s_client -status \
    -CAfile $HOME/.nodejs-tls/ca.pem \
    -cert $HOME/.nodejs-tls/client.pem \
    -key $HOME/.nodejs-tls/client-key.pem \
    -connect localhost:1111
```

Checking that the server is listening on port `1111`

```bash
lsof -nP -i4TCP:1111
```

Prints out `tcp` traffic from port `1111`

```bash
sudo tcpdump -i any -nn port 1111
```

