RSpec.describe Tsks::Request do
  before :all do
    @base_url = described_class.base_uri
  end

  describe ".post" do
    let(:uri) { URI "#{@base_url}/endpoint" }
    let(:req_body) { {param: "value"} }
    let(:httparty_res) {
      req_object = HTTParty::Request.new Net::HTTP::Get, '/'
      res_object = Net::HTTPOK.new('1.1', 200, 'OK')
      parsed_response = lambda { {"foo" => "bar"} }
      options = {body: {param: "value"}.to_json}
      response = HTTParty::Response.new(req_object,
                                        res_object,
                                        parsed_response,
                                        options)
    }

    it "Makes a POST request to a received endpoint passing received params" do
      expect(HTTParty). to receive(:post).with(uri, body: req_body)
        .and_return(httparty_res)
      described_class.post "/endpoint", req_body
    end

    it "Returns the parsed response" do
      allow(HTTParty). to receive(:post).and_return(httparty_res)
      res = described_class.post "/endpoint", {}
      expect(res.instance_of? Hash).to be true
    end
  end

  describe ".get" do
    let(:uri) { URI "#{@base_url}/endpoint" }
    let(:req_headers) { {authorization: "Bearer token"} }
    let(:success_res) { {ok: true, tsks: []}}
    let(:httparty_res) {
      req_object = HTTParty::Request.new Net::HTTP::Get, '/'
      res_object = Net::HTTPOK.new('1.1', 200, 'OK')
      parsed_response = lambda { {"foo" => "bar"} }
      options = {body: {param: "value"}.to_json}
      response = HTTParty::Response.new(req_object,
                                        res_object,
                                        parsed_response,
                                        options)
    }

    it "Makes a GET request to a received endpoint passing a received token" do
      expect(HTTParty).to receive(:get).with(uri, headers: req_headers)
        .and_return(httparty_res)
      described_class.get "/endpoint", "token"
    end

    it "Returns the parsed response" do
      allow(HTTParty).to receive(:get).and_return(httparty_res)
      res = described_class.get "/endpoint", "token"
      expect(res.instance_of? Hash).to be true
    end
  end

  describe ".delete" do
    let(:req_headers) { {authorization: "Bearer token"} }
    let(:req_body) { {param: "value"} }
    let(:httparty_res) {
      req_object = HTTParty::Request.new Net::HTTP::Get, '/'
      res_object = Net::HTTPOK.new('1.1', 200, 'OK')
      parsed_response = lambda { {"foo" => "bar"} }
      options = {body: {param: "value"}.to_json}
      response = HTTParty::Response.new(req_object,
                                        res_object,
                                        parsed_response,
                                        options)
    }

    it "Makes a DELETE request to a received endpoint passing recvd auth" do
      tsk_id = "uuid"
      uri = URI "#{@base_url}/tsks/#{tsk_id}"
      expect(HTTParty). to receive(:delete).with(uri, headers: req_headers)
        .and_return(httparty_res)
      described_class.delete "/tsks/#{tsk_id}", "token"
    end

    it "Returns the parsed response" do
      allow(HTTParty). to receive(:delete).and_return(httparty_res)
      res = described_class.delete "/endpoint", "token"
      expect(res.instance_of? Hash).to be true
    end
  end
end
