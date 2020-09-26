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
end
