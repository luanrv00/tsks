# tsks-cli

_A stateful command line interface to help you handle your daily tsks 
(with contexts!)._

## Features

* Add tsks, check what is already done and list active or archived tsks
* Synchronize your tsks and access them from all your terminals!)
* Increase your daily tsks management with contexts `tsks add tsk --context=today`
  (see `tsks help add` for more info!)

## Installation

```ruby
gem install tsks
```

## Usage

After follow the step above you should be able to run `tsks` from your terminal. 

_It's important to notice that you will need to run `tsks init` before any other 
command to setup stuffs like the storage._

### Adding new tsks

```sh
tsks add "My first tsk"
```

**Adding with context**

```sh
tsks add "Bootstraps my pet project environment --context=Personal"
```

### Checking done tsks

```sh
tsks done 2 # Where 2 is the id
```

### Listing your tsks

```sh
tsks list
```

**Filtering by context**

```sh
tsks list --context=Personal
```

**Or tsks already done**
```sh
tsks list --done
```

**Tip:** It's possible to combine the flags `--done` and `--context` when 
listing.

### Synchronizing your tsks

As easy as running `tsks sync`. This command will fetch your tsks from the API, 
then filter what is not synced yet from local, and then update both remote and 
local tsks with most recent data.

#### To be able to sync you will need to login or register an account

Run this to login:

```sh
tsks login --email=sample@mail.com --password=secret
```

Or this to register an account:

```sh
tsks register --email=sample@mail.com --password=secret
```

## Development

After checking out the repo, run `bin/setup` to install dependencies. Then, run
`rake spec` to run the tests. You can also run `bin/console` for an interactive
prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`.

## Contributing

Bug reports and pull requests are welcome on GitHub at 
https://github.com/luanrvmood/tsks-cli.
