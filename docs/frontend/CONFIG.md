# Config

Toda configuração básica necessária está localizada em `./config.json`.

O projeto utiliza esses valores como constantes dentro do projeto.

Exemplo:

```json
{
  "api_address": "192.168.0.62",
  "api_protocol": "http",
  "api_port": 8080,
  "printer": {
      "address": "192.168.0.62",
      "protocol": "http",
      "port": 8888
  },
  "dashboard_custom_page":null
}
```

## Configurações da API

|Chave        |Descrição                                      |
|-------------|-----------------------------------------------|
|api_address  |Endereço de IP do servidor backend             |
|api_protocol |Protocolo para comunicação com servidor backend|
|api_port     |Porta do servidor backend                      |

## Configurações do servidor de impressora

A configuração da impressora deve ser de acordo com o servidor [kruceo/thermal-printer](https://github.com/kruceo/thermal-printer).

|Chave        |Descrição                                      |
|-------------|-----------------------------------------------|
|address      |Endereço de IP do servidor                     |
|protocol     |Protocolo para comunicação com servidor        |
|port         |Porta do servidor                              |

## Extras 

|Chave|Descrição|
|-----|---------|
|dashboard_custom_page|Pode ser `null` ou a URL de uma pagina para ser exibida na `dashboard`|