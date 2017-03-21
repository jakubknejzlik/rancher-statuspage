# rancher-statuspage

Display status page for your services running in environment.

## Installation

Create stack with rancher-statuspage service and point load balancer to it. Example docker-compose.yml:
```
version: '2'
services:
  statuspage:
    image: jakubknejzlik/rancher-statuspage
    environment:
      # show all services (see below for more info)
      SHOW_UNLABELLED_SERVICES: true
```

*NOTE: you have to run this container inside you rancher environment*

## Configuration

You can configure statuspage with following:

* `io.rancher.statuspage.projectname`
  - specify this label on statuspage service label to change project name (page title, default: environment_name)
* `io.rancher.statuspage.name`
  - specify this label on each service you want to display in list (default `{stack_name}_{service_name}`)
* `io.rancher.statuspage.priority`
  - service label for ordering services

## Specifying displayed services

You can run statuspage in two modes:

### 1) Showing unlabelled services

Enable this mode by setting environment variable `SHOW_UNLABELLED_SERVICES=true`

In this mode you display all services. If service name label is not provided composition of stack name and service name is used.

### 2) Showing labelled services

Running this mode you have to specify which services you want to display by adding name label to each service.
