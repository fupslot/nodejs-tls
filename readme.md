### Simple TLS Server on NodeJS for testing purposes
---

### Getting Started

```bash
# Init config 
make init

# generate self-signed sertificates
make certs
```

### Start TCP/TLS Server

```bash
# start TLS server
yarn serve
```

### Connect to TCP/TLS Server using Agent

```bash
# connect to TLS server
yarn connect
```

### Connect to TCP/TLS Server using OpenSSL `s_client`

Use `openssl s_client` for quick testing the connection like so:

```bash
openssl s_client -status \
    -CAfile $HOME/.nodejs-tls/ca.pem \
    -cert $HOME/.nodejs-tls/client.pem \
    -key $HOME/.nodejs-tls/client-key.pem \
    -connect localhost:1111
```

### Debug & Troubleshooting

Checking that the server is listening on port `1111`

```bash
lsof -nP -i4TCP:1111
```

Prints out `tcp` traffic from port `1111`

```bash
sudo tcpdump -i any -nn port 1111
```

